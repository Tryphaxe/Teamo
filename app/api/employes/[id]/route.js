import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function GET(_, { params }) {
  const employe = await prisma.user.findUnique({
    where: { id: params.id },
  });
  return NextResponse.json(employe);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const data = await req.json();

  try {
    const employe = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        password: data.password,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        adresse: data.adresse,
        genre: data.genre,
        dateNaissance: data.dateNaissance ? new Date(data.dateNaissance) : null,
        dateEntree: data.dateEntree ? new Date(data.dateEntree) : null,
        dateSortie: data.dateSortie ? new Date(data.dateSortie) : null,
        poste: data.poste,
        salaire: data.salaire ? parseFloat(data.salaire) : null,
        departementId: data.departementId ? data.departementId : null
      },
    });
    return NextResponse.json(employe);
  } catch (error) {
    console.error("Erreur de mise à jour de l'employé :", error); // ✅ log utile
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {

    // Récupérer l'employé et ses fichiers
    const employe = await prisma.user.findUnique({
      where: { id },
      include: { files: true },
    });

    if (!employe) {
      return NextResponse.json({ error: "Employé introuvable." }, { status: 404 });
    }

    const folder = `employes/${employe.nom.replace(/\s+/g, '_')}_${employe.prenom.replace(/\s+/g, '_')}`;

    // Lister tous les fichiers dans le dossier
    const { data: filesInFolder, error: listError } = await supabase.storage
      .from('user-files')
      .list(folder, { recursive: true });

    if (listError) {
      console.error('Erreur listage:', listError);
    }

    // Supprimer tous les fichiers du dossier
    if (filesInFolder && filesInFolder.length > 0) {
      const filePaths = filesInFolder.map(file => `${folder}/${file.name}`);

      const { error: deleteError } = await supabase.storage
        .from('user-files')
        .remove(filePaths);

      if (deleteError) {
        console.error('Erreur suppression fichiers:', deleteError);
      }
    }

    // Supprimer les fichiers dans la base de données
    await prisma.userFile.deleteMany({
      where: { userId: id },
    });

    // Supprimer l'employé
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Delete success" }, { status: 200 });
  } catch (error) {
    console.error("Erreur suppression : ", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
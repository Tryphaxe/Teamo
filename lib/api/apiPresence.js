import axios from 'axios';

export async function fetchPresence(date) {
	try {
		const formattedDate = date.toISOString().split('T')[0]; // Ex: "2025-08-02"

		const response = await axios.get('/api/presences', {
			params: {
				date: formattedDate,
			},
		});

		return response.data;
	} catch (error) {
		console.error('Erreur lors du fetch des présences:', error);
		throw new Error('Impossible de récupérer les présences');
	}
}

// ✅ Vérifier si l’employé a déjà validé sa présence pour une date donnée
export const checkPresence = async (date) => {
  try {
    const res = await fetch(`/api/presences/check?date=${date}`);
    const data = await res.json();
    return data.present;
  } catch (err) {
    console.error('Erreur lors de la vérification de la présence:', err);
    return false;
  }
};

// ✅ Enregistrer une présence (true ou false)
export const submitPresence = async (present) => {
  try {
    const res = await fetch('/api/presences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({pres: present}),
    });

    if (!res.ok) throw new Error('Erreur de soumission');
    return true;
  } catch (err) {
    console.error('Erreur lors de l’envoi de la présence:', err);
    return false;
  }
};
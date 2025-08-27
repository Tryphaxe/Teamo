import axios from 'axios';
import toast from 'react-hot-toast';
import { supabase } from '../supabase';

/**
 * Récupère les dépenses depuis l'API et met à jour l'état.
 * @param {Function} setData - Fonction pour mettre à jour les données des dépenses.
 * @param {Function} [setIsLoading] - Fonction optionnelle pour gérer l'état de chargement.
 */
export const fetchDepenses = async (setData, setIsLoading) => {
    try {
        const res = await axios.get('/api/depenses');
        setData(res.data);
    } catch (error) {
        toast.error('Erreur lors du chargement des dépenses.');
        console.error('Erreur de l\'API lors de la récupération des dépenses:', error);
    } finally {
        if (setIsLoading) {
            setIsLoading(false);
        }
    }
};

/**
 * Soumet un formulaire de dépense, gère l'upload de fichier et l'envoi à l'API.
 * @param {Object} params - Paramètres de la fonction.
 * @param {Object} params.data - Données du formulaire.
 * @param {Function} [params.onSuccess] - Callback en cas de succès.
 * @param {Function} [params.onError] - Callback en cas d'erreur.
 * @param {Function} params.setLoading - Fonction pour gérer l'état de chargement.
 * @param {Function} [params.setShowForm] - Fonction pour fermer le formulaire.
 * @param {Function} [params.reload] - Fonction pour recharger les données.
 * @param {string} [params.successMessage] - Message de succès personnalisé.
 * @param {string} [params.errorMessage] - Message d'erreur personnalisé.
 */
export const submitForm = async ({
    data,
    onSuccess,
    onError,
    setLoading,
    setShowForm,
    reload,
    successMessage = 'Enregistré avec succès.',
    errorMessage = 'Erreur lors de l\'enregistrement.',
}) => {
    setLoading(true);
    const toastId = toast.loading("Enregistrement en cours...");

    try {
        let justificatifUrl = null;
        let justificatifName = null;

        if (data.fichier) {
            const file = data.fichier;
            const fileExtension = file.name.split('.').pop();
            const fileName = `justificatif-${Date.now()}.${fileExtension}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('depense-justificatifs')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) {
                // Gestion plus précise des erreurs d'upload
                if (uploadError.statusCode === '413') {
                    throw new Error("Le fichier est trop volumineux.");
                }
                throw uploadError;
            }

            justificatifUrl = supabase.storage
                .from('depense-justificatifs')
                .getPublicUrl(uploadData.path).data.publicUrl;

            justificatifName = file.name;
        }

        const payload = {
            description: data.description,
            projetId: data.projetId,
            montant: parseFloat(data.montant),
            justificatifUrl,
            justificatifName,
        };

        const res = await axios.post("/api/depenses", payload);

        toast.success(successMessage, { id: toastId });
        if (onSuccess) onSuccess(res.data);
        if (setShowForm) setShowForm(false);
        if (reload) reload();

    } catch (error) {
        const errorMsg = error.message || error.response?.data?.error || errorMessage;
        toast.error(errorMsg, { id: toastId });
        if (onError) onError(error);
        console.error('Erreur lors de la soumission du formulaire:', error);
    } finally {
        setLoading(false);
    }
};

/**
 * Met à jour le statut d'une dépense (valider ou refuser).
 * @param {string} id - L'ID de la dépense à mettre à jour.
 * @param {string} statut - Le nouveau statut ('ACCEPTE' ou 'REFUSE').
 * @param {Function} [reload] - Fonction pour recharger les données après la mise à jour.
 */
export const updateDepenseStatus = async (id, statut, reload) => {
    const action = statut === "ACCEPTE" ? "Validation" : "Refus";
    const toastId = toast.loading(`${action} de la dépense en cours...`);

    try {
        await axios.put(`/api/depenses/${id}`, { statut });
        toast.success(`Dépense ${statut === "ACCEPTE" ? "validée" : "refusée"} avec succès.`, { id: toastId });
        if (reload) {
            reload();
        }
    } catch (error) {
        toast.error(`Erreur lors du ${action.toLowerCase()} de la dépense.`, { id: toastId });
        console.error(`Erreur lors de la mise à jour du statut pour l'ID ${id}:`, error);
    }
};

// Fonctions d'export simplifiées pour une meilleure lisibilité dans les composants
export const validerDepense = (id, reload) => updateDepenseStatus(id, "ACCEPTE", reload);
export const refuserDepense = (id, reload) => updateDepenseStatus(id, "REFUSE", reload);
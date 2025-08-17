import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchDepartements = async (setData, setIsLoading) => {
	try {
		const res = await axios.get('/api/departements');
		setData(res.data);
	} catch (error) {
		toast.error('Erreur lors du chargement des departements.');
	} finally {
		if (setIsLoading) setIsLoading(false);
	}
};

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
	const toastDep = toast.loading("Enregistrement en cours...");

	try {
		const res = await axios({
			method: 'post',
			url: "/api/departements",
			data,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		toast.success(successMessage, { id: toastDep });

		if (onSuccess) onSuccess(res.data);
		if (setShowForm) setShowForm(false);
		if (reload) reload();

	} catch (error) {
		const message =
			error?.response?.data?.error || errorMessage;

		toast.error(message, { id: toastDep });

		if (onError) onError(error);
	} finally {
		setLoading(false);
	}
};

//  Fonction pour supprimer
export const deleteDepartement = async (id, reload = null) => {
	const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer ce departement ?");
	if (!confirm) return;

	const toastDep = toast.loading("Suppression en cours...");

	try {
		await axios.delete(`/api/departements/${id}`);
		toast.success("Departement supprimé avec succès.", { id: toastDep });

		if (reload) reload();
	} catch (error) {
		const message = error?.response?.data?.error || "Erreur lors de la suppression.";
		toast.error(message, { id: toastDep });
	}
};
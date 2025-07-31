import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchVacances = async (setData, setIsLoading) => {
	try {
		const res = await axios.get('/api/vacances');
		setData(res.data);
	} catch (error) {
		toast.error('Erreur lors du chargement des vacances');
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
	const toastId = toast.loading("Enregistrement en cours...");

	try {
		const res = await axios({
			method: 'post',
			url: "/api/vacances",
			data,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		toast.success(successMessage, { id: toastId });

		if (onSuccess) onSuccess(res.data);
		if (setShowForm) setShowForm(false);
		if (reload) reload();

	} catch (error) {
		const message =
			error?.response?.data?.error || errorMessage;

		toast.error(message, { id: toastId });

		if (onError) onError(error);
	} finally {
		setLoading(false);
	}
};

//  Fonction pour supprimer
export const deleteVacance = async (id, reload = null) => {
	const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer cette vacance ?");
	if (!confirm) return;

	const toastId = toast.loading("Suppression en cours...");

	try {
		await axios.delete(`/api/vacances/${id}`);
		toast.success("Vacance supprimée avec succès.", { id: toastId });

		if (reload) reload();
	} catch (error) {
		const message = error?.response?.data?.error || "Erreur lors de la suppression.";
		toast.error(message, { id: toastId });
	}
};
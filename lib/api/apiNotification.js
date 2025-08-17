import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchNotifs = async (setData, setIsLoading) => {
	try {
		const res = await axios.get('/api/notifications');
		setData(res.data);
	} catch (error) {
		toast.error('Erreur lors du chargement des notifications.');
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
	const toastNotif = toast.loading("Enregistrement en cours...");

	try {
		const res = await axios({
			method: 'post',
			url: "/api/notifications",
			data,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		toast.success(successMessage, { id: toastNotif });

		if (onSuccess) onSuccess(res.data);
		if (setShowForm) setShowForm(false);
		if (reload) reload();

	} catch (error) {
		const message =
			error?.response?.data?.error || errorMessage;

		toast.error(message, { id: toastNotif });

		if (onError) onError(error);
	} finally {
		setLoading(false);
	}
};

//  Fonction pour supprimer
export const deleteNotif = async (id, reload = null) => {
	const toastNotif = toast.loading("Suppression en cours...");

	try {
		await axios.delete(`/api/notifications/${id}`);
		toast.success("Notification supprimé avec succès.", { id: toastNotif });

		if (reload) reload();
	} catch (error) {
		const message = error?.response?.data?.error || "Erreur lors de la suppression.";
		toast.error(message, { id: toastNotif });
	}
};
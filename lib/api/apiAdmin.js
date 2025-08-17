import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchAdmins = async (setData, setIsLoading) => {
	try {
		const res = await axios.get('/api/admins');
		setData(res.data);
	} catch (error) {
		toast.error('Erreur lors du chargement des administrateurs.');
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
	const toastAdmin = toast.loading("Enregistrement en cours...");

	try {
		const res = await axios({
			method: 'post',
			url: "/api/admins",
			data,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		toastAdmin.success(successMessage, { id: toastAdmin });

		if (onSuccess) onSuccess(res.data);
		if (setShowForm) setShowForm(false);
		if (reload) reload();

	} catch (error) {
		const message =
			error?.response?.data?.error || errorMessage;

		toastAdmin.error(message, { id: toastAdmin });

		if (onError) onError(error);
	} finally {
		setLoading(false);
	}
};

//  Fonction pour supprimer
export const deleteAdmin = async (id, reload = null) => {
	const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?");
	if (!confirm) return;

	const toastAdmin = toast.loading("Suppression en cours...");

	try {
		await axios.delete(`/api/admins/${id}`);
		toastAdmin.success("Administrateur supprimé avec succès.", { id: toastAdmin });

		if (reload) reload();
	} catch (error) {
		const message = error?.response?.data?.error || "Erreur lors de la suppression.";
		toastAdmin.error(message, { id: toastAdmin });
	}
};
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchEmployes = async (setData, setIsLoading) => {
	try {
		const res = await axios.get('/api/employes');
		setData(res.data);
	} catch (error) {
		toast.error('Erreur lors du chargement des employés.');
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
	const toastEmp = toast.loading("Enregistrement en cours...");

	try {
		const res = await axios({
			method: 'post',
			url: "/api/employes",
			data,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		toast.success(successMessage, { id: toastEmp });

		if (onSuccess) onSuccess(res.data);
		if (setShowForm) setShowForm(false);
		if (reload) reload();

	} catch (error) {
		const message =
			error?.response?.data?.error || errorMessage;

		toast.error(message, { id: toastEmp });

		if (onError) onError(error);
	} finally {
		setLoading(false);
	}
};

//  Fonction pour supprimer
export const deleteEmploye = async (id, reload = null) => {
	const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?");
	if (!confirm) return;

	const toastEmp = toast.loading("Suppression en cours...");

	try {
		await axios.delete(`/api/employes/${id}`);
		toast.success("Employé supprimé avec succès.", { id: toastEmp });

		if (reload) reload();
	} catch (error) {
		const message = error?.response?.data?.error || "Erreur lors de la suppression.";
		toast.error(message, { id: toastEmp });
	}
};
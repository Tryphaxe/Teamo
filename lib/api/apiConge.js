import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchConges = async (setData, setIsLoading) => {
	try {
		const res = await axios.get('/api/conges');
		setData(res.data);
	} catch (error) {
		toast.error('Erreur lors du chargement des congés');
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
	const toastConge = toast.loading("Enregistrement en cours...");

	try {
		const res = await axios({
			method: 'post',
			url: "/api/conges",
			data,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		toast.success(successMessage, { id: toastConge });

		if (onSuccess) onSuccess(res.data);
		if (setShowForm) setShowForm(false);
		if (reload) reload();

	} catch (error) {
		const message =
			error?.response?.data?.error || errorMessage;

		toast.error(message, { id: toastConge });

		if (onError) onError(error);
	} finally {
		setLoading(false);
	}
};

//  Valider un congé
export const validerConge = async (id, reload) => {
	const toastConge = toast.loading("Validation du congé...");
	try {
		await axios.put(`/api/conges/${id}`, { statut: "VALIDE" });
		toast.success("Congé validé", { id: toastConge });
		if (reload) reload();
	} catch (error) {
		toast.error("Erreur lors de la validation", { id: toastConge });
	}
};

//  Refuser un congé
export const refuserConge = async (id, reload) => {
	const toastConge = toast.loading("Refus du congé...");
	try {
		await axios.put(`/api/conges/${id}`, { statut: "REFUSE" });
		toast.success("Congé refusé", { id: toastConge });
		if (reload) reload();
	} catch (error) {
		toast.error("Erreur lors du refus", { id: toastConge });
	}
};
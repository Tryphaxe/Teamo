import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchDepenses = async (setData, setIsLoading) => {
	try {
		const res = await axios.get('/api/depenses');
		setData(res.data);
	} catch (error) {
		toast.error('Erreur lors du chargement des dépenses');
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
	const toastDepense = toast.loading("Enregistrement en cours...");

	try {
		const res = await axios({
			method: 'post',
			url: "/api/depenses",
			data,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		toast.success(successMessage, { id: toastDepense });

		if (onSuccess) onSuccess(res.data);
		if (setShowForm) setShowForm(false);
		if (reload) reload();

	} catch (error) {
		const message =
			error?.response?.data?.error || errorMessage;

		toast.error(message, { id: toastDepense });

		if (onError) onError(error);
	} finally {
		setLoading(false);
	}
};

//  Valider une dépenses
export const validerDepense = async (id, reload) => {
	const toastDepense = toast.loading("Validation de la dépense...");
	try {
		await axios.put(`/api/depenses/${id}`, { statut: "ACCEPTE" });
		toast.success("Dépense validée", { id: toastDepense });
		if (reload) reload();
	} catch (error) {
		toast.error("Erreur lors de la validation", { id: toastDepense });
	}
};

//  Refuser une dépenses
export const refuserDepense = async (id, reload) => {
	const toastDepense = toast.loading("Refus de la dépense...");
	try {
		await axios.put(`/api/depenses/${id}`, { statut: "REFUSE" });
		toast.success("Dépense refusée", { id: toastDepense });
		if (reload) reload();
	} catch (error) {
		toast.error("Erreur lors du refus", { id: toastDepense });
	}
};
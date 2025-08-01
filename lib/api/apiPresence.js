import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchPresences = async (setData, setIsLoading) => {
	try {
		const res = await axios.get('/api/presences');
		setData(res.data);
	} catch (error) {
		toast.error('Erreur lors du chargement des présences');
	} finally {
		if (setIsLoading) setIsLoading(false);
	}
};

export const getPresencesByDate = async (date, setData, setLoading) => {
	setLoading?.(true);

	try {
		const res = await axios.get(`/api/presences/${date}`);
		setData(res.data);
	} catch (error) {
		toast.error('Erreur lors du chargement des présences');
	} finally {
		setLoading?.(false);
	}
};

export const submitPresence = async (isPresent) => {
	const toastId = toast.loading("Ajout de présence en cours...", { id: toastId });
	try {
		const res = await axios.post('/api/presences', {
			present: isPresent,
		});

		toast.success(`Présence enregistrée : ${isPresent ? 'Présent' : 'Absent'}`);
		return res.data;
	} catch (error) {
		console.error(error);
		toast.error("Erreur lors de l'enregistrement", { id: toastId });
	}
};

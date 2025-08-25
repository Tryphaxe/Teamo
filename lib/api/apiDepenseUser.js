import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchDepenses = async (setData, setIsLoading) => {
	try {
		const res = await axios.get('/api/depenses/user');
		setData(res.data);
	} catch (error) {
		toast.error('Erreur lors du chargement des dépenses');
	} finally {
		if (setIsLoading) setIsLoading(false);
	}
};
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchConges = async (setData, setIsLoading) => {
	try {
		const res = await axios.get('/api/conges/user');
		setData(res.data);
	} catch (error) {
		toast.error('Erreur lors du chargement des congés');
	} finally {
		if (setIsLoading) setIsLoading(false);
	}
};
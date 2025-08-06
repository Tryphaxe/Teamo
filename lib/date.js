import { format, parseISO, isValid } from 'date-fns';

// 📅 Format ISO pour l’API et les requêtes
export const getFormattedDate = (date = new Date()) => {
  return format(date, 'yyyy-MM-dd'); // ex: "2025-08-02"
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('fr-FR', { dateStyle: 'medium' });
};

export const getHeureFromDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
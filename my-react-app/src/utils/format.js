export const formatMoney = (amount) => {
  const value = Number(amount);
  return new Intl.NumberFormat('uz-UZ').format(Number.isFinite(value) ? value : 0) + " so'm";
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ? new Date(`${dateString}T00:00:00`)
    : new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export const localDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const currentMonthString = () => localDateString().slice(0, 7);

export const studentName = (student) => {
  if (!student) return 'Noma\'lum';
  return `${student.firstName || ''} ${student.lastName || ''}`.trim();
};

export const statusLabel = (status) => {
  const map = {
    active: 'Faol',
    frozen: 'Muzlatilgan',
    left: 'Chiqib ketgan',
    finished: 'Tugatilgan',
    present: 'Kelgan',
    absent: 'Kelmagan',
    late: 'Kechikkan',
    naqd: 'Naqd',
    karta: 'Karta',
    click: 'Click'
  };
  return map[status] || status;
};

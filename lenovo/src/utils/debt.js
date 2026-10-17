export function calculateStudentDebt(student, group, payments, currentMonth) {
  if (!student || !group || student.status !== 'active' || !Array.isArray(payments)) {
    return { debtAmount: 0, isDebtor: false };
  }

  const studentPayments = payments.filter(
    (p) => String(p.studentId) === String(student.id) && p.month === currentMonth
  );

  const totalPaid = studentPayments.reduce((sum, p) => {
    const amount = Number(p.amount);
    return sum + (Number.isFinite(amount) && amount > 0 ? amount : 0);
  }, 0);
  const monthlyPrice = Number(group.monthlyPrice);
  const debtAmount = Number.isFinite(monthlyPrice)
    ? Math.max(0, monthlyPrice - totalPaid)
    : 0;

  return {
    debtAmount,
    isDebtor: debtAmount > 0
  };
}

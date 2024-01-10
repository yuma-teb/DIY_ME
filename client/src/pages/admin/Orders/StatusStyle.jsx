const StatusType = (status) => {
  switch (status) {
    case 'pending':
      return { color: '#E46A11', }; 
    case 'shipped':
      return { color: '#13B2E4' };
    case 'delivered':
      return { color: '#0D894F' };
    case 'canceled':
      return { color: 'red' };
    case 'refunded':
      return { color: '#2fb3b1' };
    case 'Not yet Refund':
      return { color: '#f1c21b' };
    default:
      return {};
  }
}

export default StatusType;

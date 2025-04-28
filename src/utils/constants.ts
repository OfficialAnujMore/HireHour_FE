export const CATEGORY = {
  art: 'Art',
  music: 'Music',
  sports: 'Sports',
};

export const VENUE = {
  offline: 'Offline',
  online: 'Online',
};

export const USER_DETAILS = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  phoneNumber: '',
  password: '',
};

export const MAX_SCHEDULE_DISPLAY = 5;

export const  DUMMY_DATA = [
  {
    userId: '1df1aaba-153a-4e70-9e01-0e831ae3fd26',
    serviceId: '4bbc181c-1d0f-40a4-a50a-a56ec2521e59',
    title: 'Dog Service',
    description: 'We provide dog service',
    totalAmt: '180.00',
    transactionType: 'cash',
    status: 'confirmed',
    transactionId: '121223434787823',
    transactionDateTime: '2025-02-10 00:28:36.635',
  },
  {
    userId: '1df1aaba-153a-4e70-9e01-0e831ae3fd26',
    serviceId: 'f8539bd6-11c7-4ee4-a6a7-9eb7342cc50b',
    title: 'Flower Service',
    description: 'We provide flower service',
    totalAmt: '180.00',
    transactionType: 'card',
    status: 'pending',
    transactionId: '121223434787824',
    transactionDateTime: '2025-02-10 00:28:36.635',
  },
  {
    userId: '1df1aaba-153a-4e70-9e01-0e831ae3fd26',
    serviceId: 'a1239bd6-22c7-4ee4-b6a7-9eb7342cc50c',
    title: 'Flower Service',
    description: 'We provide flower service',
    totalAmt: '180.00',
    transactionType: 'paypal',
    status: 'cancelled',
    transactionId: '121223434787825',
    transactionDateTime: '2025-02-10 00:28:36.635',
  },
];

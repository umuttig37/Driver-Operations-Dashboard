const drivers = [
  {
    id: 1,
    name: 'Umut',
    city: 'Helsinki',
    status: 'active',
  },
  {
    id: 2,
    name: 'Mika',
    city: 'Espoo',
    status: 'active',
  },
  {
    id: 3,
    name: 'Janne',
    city: 'Vantaa',
    status: 'off-duty',
  },
];

const jobs = [
  {
    id: 1,
    code: 'JOB-101',
    title: 'Morning route',
    pickup: 'Helsinki',
    dropoff: 'Lahti',
    status: 'open',
    driverId: 1,
    etaHours: 3,
  },
  {
    id: 2,
    code: 'JOB-102',
    title: 'Warehouse transfer',
    pickup: 'Espoo',
    dropoff: 'Tampere',
    status: 'in_progress',
    driverId: 2,
    etaHours: 4,
  },
  {
    id: 3,
    code: 'JOB-103',
    title: 'Evening drop',
    pickup: 'Vantaa',
    dropoff: 'Turku',
    status: 'done',
    driverId: 3,
    etaHours: 5,
  },
];

module.exports = { drivers, jobs };

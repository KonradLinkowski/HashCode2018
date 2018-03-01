const fs = require('fs');

const paths = {
  a: 'a_example.in',
  b: 'b_should_be_easy.in',
  c: 'c_no_hurry.in',
  d: 'd_metropolis.in',
  e: 'e_high_bonus.in'
}

let data = fs.readFileSync(paths.a, 'utf8');

class Vehicle {
  constructor(x, y, time) {
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.time = parseInt(time);
    this.rides = [];
  }
  // odległość do a i b
  stepsTo(a, b) {
    return Math.abs(a - this.x) + Math.abs(b - this.y)
  }
  // idź do a i b, ustaw czas
  goto(a, b) {
    this.x = a;
    this.y = b;
    this.time += this.stepsTo(a, b);
  }
  // weź pasażera i zawieź go na miejsce, ustaw czas
  makeRide(ride) {
    this.x = ride.x;
    this.y = ride.y;
    this.time += this.stepsTo(a, b);
    this.rides.push(ride.id)
  }
  // output koncowy
  toString() {
    let out = [this.rides.length.toString()];
    for (let i = 0; i < this.rides.length; i++) {
      out.push(this.rides[i].toString())
    }
    return out.join(' ');
  }
}

class Ride {
  constructor(id, a, b, x, y, ear, last) {
    this.id = parseInt(id);
    this.a = parseInt(a);
    this.b = parseInt(b);
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.ear = parseInt(ear);
    this.last = parseInt(last);
    this.distance = Math.abs(this.x - this.a) + Math.abs(this.y - this.b);
  }
}

data = data.split('\n')
for (let i = 0; i < data.length; i++) {
  data[i] = data[i].split(' ')
}

const R = data[0][0]
const C = data[0][1]
const F = data[0][2]
const N = data[0][3]
const B = data[0][4]
const T = data[0][5]

let vehicles = [];

for (let i = 0; i < F; i++) {
  vehicles.push(new Vehicle(0, 0, 0))
}

let rides = [];

for (let i = 0; i < N; i++) {
  rides.push(new Ride(i, data[i + 1][0], data[i + 1][1], data[i + 1][2], data[i + 1][3], data[i + 1][4], data[i + 1][5]))
}

console.log(rides)
while(rides.length !== 0) {
  rides.sort((a, b) => {
    return a.ear > b.ear;
  })
  vehicles.forEach(veh => {
    if (rides.length === 0) {
      return;
    }
    if (veh.time <= veh.stepsTo(rides[0].a, rides[0].b)) {
      veh.goTo(rides[0]);
      rides.splice(0, 1);
    }
  })
}

vehicles.forEach(veh => {
  console.log(veh.toString())
})
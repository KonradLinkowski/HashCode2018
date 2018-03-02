const fs = require('fs');

const paths = {
  a: 'a_example.in',
  b: 'b_should_be_easy.in',
  c: 'c_no_hurry.in',
  d: 'd_metropolis.in',
  e: 'e_high_bonus.in'
}

let data = fs.readFileSync(paths.b, 'utf8');

class Vehicle {
  constructor(x, y, time) {
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.time = parseInt(time);
    this.points = 0;
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
    this.time += this.stepsTo(ride.a, ride.b);
    //console.log(this.time, ride.ear)
    if (this.time < ride.ear) {
      //console.log('bonus', ride.id)
      bonus++;
      this.points += B;
    }
    this.time += ride.distance;
    this.points += ride.distance;
    this.x = ride.x;
    this.y = ride.y;
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
let bonus = 0;
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

const R = parseInt(data[0][0])
const C = parseInt(data[0][1])
const F = parseInt(data[0][2])
const N = parseInt(data[0][3])
const B = parseInt(data[0][4])
const T = parseInt(data[0][5])

let vehicles = [];

for (let i = 0; i < F; i++) {
  vehicles.push(new Vehicle(0, 0, 0))
}

let rides = [];

for (let i = 0; i < N; i++) {
  rides.push(new Ride(i, data[i + 1][0], data[i + 1][1], data[i + 1][2], data[i + 1][3], data[i + 1][4], data[i + 1][5]))
}

//console.log(rides)
let tempLength;
while(rides.length !== 0) {
  //console.log(rides.length)
  tempLength = rides.length;
  vehicles.forEach(veh => {
    if (rides.length === 0) {
      return;
    }
    let index = calc(rides, veh)
    if (index !== null) {
      veh.makeRide(rides[index]);
      rides.splice(index, 1);
    }
  })
  if (tempLength == rides.length) {
    break;
  }
}
let points = 0;
let output = '';
vehicles.forEach(veh => {
  points += parseInt(veh.points);
  output += veh.toString() + '\n'
})
console.log(output)
console.log('points', points)
console.log('bonus bgc', bonus)
//fs.writeFileSync('e.out', output);

function calc(array, veh) {
  let best = 0 //array[0].distance / (array[0].distance + veh.stepsTo(array[0].a, array[0].b));
  let index = null;
  for (let i = 0; i < array.length; i++) {
    if (veh.time >= rides[i].last + veh.stepsTo(rides[i].x, rides[i].y)) {
      continue
    }
    let temp = array[i].distance / (array[i].distance + veh.stepsTo(array[i].x, array[i].y));
    //console.log(veh, i, temp, best)
    if (temp > best) {
      //console.log('przepis')
      best = temp;
      index = i;
    }
  }
  //console.log('index', index)
  return index;
}
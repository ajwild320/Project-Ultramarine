const {v4: uuidv4} = require('uuid');

let events = [
  {
    id: uuidv4(),
    category: "Warhammer 40K",
    title: "Astra Militarum Vs Tyranids",
    hostName: "Fred Sanford",
    startDateTime: "2023-10-15T09:00",
    endDateTime: "2023-10-17T17:00",
    location: "Charlotte, NC",
    details: "Join us for an exciting duel of claws and firepower",
    image: "Astra_Tyranids.png",
  },
  {
    id: uuidv4(),
    category: "Warhammer Fantasy",
    title: "Empire Vs. Skaven",
    hostName: "Greg Jones",
    startDateTime: "2023-11-20T18:00",
    endDateTime: "2023-11-20T23:59",
    location: "Gatlinburg, TN",
    details: "Lets throwback to warhammer fantasy and have a brawl for the ages!",
    image: "skaven.jpg",
  },
  {
    id: uuidv4(),
    category: "Meet and Chill",
    title: "Discussing New Lore",
    hostName: "Cedric Wilson",
    startDateTime: "2023-09-25T10:30",
    endDateTime: "2023-09-25T16:00",
    location: "Tampa Bay, FL",
    details: "Greetings ladies and gents, let's discuss the new arks of omen lore together!",
    image: "Arks_of_omen.jpg",
  },
  {
    id: uuidv4(),
    category: "Painting Session",
    title: "Time to Paint!",
    hostName: "Alan Jenkins",
    startDateTime: "2023-11-05T08:30",
    endDateTime: "2023-11-07T17:30",
    location: "New York, NY",
    details: "Bring any models you like, I'll supply the paint!",
    image: "custodian_warrior.jpg",
  },
  {
    id: uuidv4(),
    category: "Painting Session",
    title: "Knights of the Adeptus Mechanicus",
    hostName: "Sarah Smith",
    startDateTime: "2023-10-28T20:00",
    endDateTime: "2023-10-28T23:00",
    location: "Greensboro, NC",
    details: "Bring your Knights and lets paint them together!",
    image: "Imperial_Knight.jpg",
  },
  {
    id: uuidv4(),
    category: "Painting Session",
    title: "Skitarii Paint Night",
    hostName: "Scott Sanchez",
    startDateTime: "2023-09-30T14:00",
    endDateTime: "2023-09-30T16:30",
    location: "San Francisco, CA",
    details: "Time to paint some ad mech skitarii everyone!",
    image: "Skitarii.jpg",
  },
];

exports.find = () => events;

exports.findById = (id) => events.find(event => event.id === id);

exports.save = function (event) {
    event.id = uuidv4();
    events.push(event);
};

exports.updateById = (id, updatedEvent, image) => {
  const index = events.findIndex(event => event.id === id);
  if (index !== -1) {
    updatedEvent.id = id;
    updatedEvent.image = image;
    events[index] = updatedEvent;
    // events[index].image = image;
    return true;
  } else {
      return false;
  }
}

exports.create = event => {
  event.id = uuidv4();
  event.createdAt = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
  events.push(event);
}

exports.deleteByID = id => {
  const index = events.findIndex(event => event.id === id);
  if (index !== -1) {
      events.splice(index, 1);
      return true;
  } else {
      return false;
  }
}

exports.obtainCategories = function (events) {
  const categoriesList = ['Warhammer Fantasy', 'Warhammer 40K', 'Meet and Chill', 'Painting Session', 'Other'];
  return categoriesList;
}
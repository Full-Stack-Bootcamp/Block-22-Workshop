const newPartyForm = document.querySelector("#new-party-form");
const partyContainer = document.querySelector(`#party-container`);

const PARTIES_API_URL =
  "http://fsa-async-await.herokuapp.com/api/workshop/parties";
const GUESTS_API_URL =
  "http://fsa-async-await.herokuapp.com/api/workshop/guests";
const RSVPS_API_URL = "http://fsa-async-await.herokuapp.com/api/workshop/rsvps";
const GIFTS_API_URL = "http://fsa-async-await.herokuapp.com/api/workshop/gifts";
const newInfoObj = {
  name: "Name",
  event: "event",
  city: "City",
  state: "State",
  country: "Country",
};

// get all parties
const getAllParties = async () => {
  try {
    const response = await fetch(PARTIES_API_URL);
    const parties = await response.json();
    console.log(parties);
    return parties;
  } catch (error) {
    console.error(error);
  }
};

// get single party by id
const getPartyById = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};

// delete party
// The code i wrote :
// const deleteParty = async (id) => {
//   // your code here
//   try {
//     const res = await fetch(`${PARTIES_API_URL}/${id}`, {
//       method: "DELETE",
//       headers: {
//         "Content-type": "application/json",
//       },
//     });
//     console.log(res);
//     const json = await res.json();
//     console.log(json);
//   } catch (err) {
//     console.log(err);
//   }
// };
// Amadeo's Code
const deleteParty = async (id) => {
  const res = await fetch(`${PARTIES_API_URL}/${id}`, {
    method: "DELETE",
  });
  const party = await res.json();

  console.log(party);
  return party;
};

// Attempting to add POST function to add information that I dont have to this api? I guess?
// POST -
// const addInfo = async (id) => {
//   // async function addInfo(id) {
//   try {
//     const res = await fetch(`${PARTIES_API_URL}/${id}`, {
//       method: "POST",
//       body: JSON.stringify(newInfoObj),
//       headers: {
//         "Content-type": "application/json",
//       },
//     });
//     console.log(`${PARTIES_API_URL}/${id}`);
//     console.log(res);
//     const json = await res.json();
//     console.log(json);
//   } catch (err) {
//     console.log("ERROR:");
//     console.log(err);
//   }
// };

// render a single party by id
const renderSinglePartyById = async (id) => {
  try {
    const singlePartyContainer = document.querySelector(`#no${id}`);
    console.log(singlePartyContainer);
    // fetch party details from server
    const party = await getPartyById(id);

    // POST information I dont have?
    // addInfo(newInfoObj, id);
    // console.log(`id is ${id}`);
    // console.log(`newInfoObj: `);
    // console.log(newInfoObj);
    // console.log(id.name);

    // GET - /api/workshop/guests/party/:partyId - get guests by party id
    const guestsResponse = await fetch(`${GUESTS_API_URL}/party/${id}`);
    console.log(`guest response:`);
    console.log(guestsResponse);
    // console.log(`${GUESTS_API_URL}/${id}`);
    const guests = await guestsResponse.json();
    console.log(`guests:`);
    console.log(guests);

    // GET - /api/workshop/rsvps/party/:partyId - get RSVPs by partyId
    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/party/${id}`);
    const rsvps = await rsvpsResponse.json();
    console.log(`rsvps =`);
    console.log(rsvps);

    // GET - get all gifts by party id - /api/workshop/parties/gifts/:partyId -BUGGY?
    // const giftsResponse = await fetch(`${PARTIES_API_URL}/party/gifts/${id}`);
    // const gifts = await giftsResponse.json();

    // create new HTML element to display party details
    const partyDetailsElement = document.createElement("div");
    partyDetailsElement.classList.add("party-details");
    partyDetailsElement.innerHTML = `
            <h2>${party.name}</h2>
            <p>${party.description}</p>
            <p>${party.location}</p>
            <p>${party.time}</p>
            <h3>Guests:</h3>
            <ul>
            ${guests
              .map(
                (guest, index) => `
              <li>
                <div>${guest.name}</div>
                <div>${rsvps[index].status}</div>
              </li>
            `
              )
              .join("")}
          </ul>
          


            <button class="close-button">Close</button>
        `;
    // console.log(`guests are: ${guests}`);
    // console.log(`rsvps are ${rsvps}`);
    singlePartyContainer.appendChild(partyDetailsElement);
    // partyContainer.appendChild(partyDetailsElement);

    // add event listener to close button
    const closeButton = partyDetailsElement.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
      partyDetailsElement.remove();
    });
  } catch (error) {
    console.error(error);
  }
};

// render all parties
const renderParties = async (parties) => {
  try {
    partyContainer.innerHTML = "";
    parties.forEach((party) => {
      const partyElement = document.createElement(`div`);
      partyElement.setAttribute("id", `no${party.id}`);
      partyElement.classList.add("party");
      partyElement.innerHTML = `
                <h2>${party.name}</h2>
                <p>${party.description}</p>
                <p>${party.date}</p>
                <p>${party.time}</p>
                <p>${party.location}</p>
                <button class="details-button" data-id="${party.id}">See Details</button>
                <button class="delete-button" data-id="${party.id}">Delete</button>
            `;
      // addInfo(party.id);
      partyContainer.appendChild(partyElement);

      // see details
      const detailsButton = partyElement.querySelector(".details-button");
      detailsButton.addEventListener("click", async (event) => {
        // your code here
        // const newInfo = await addInfo(party.id);
        // console.log(`NEWINFO: ${newInfo}`);
        // console.log(newInfo);

        // const partyInfo = await getPartyById(party.id);
        let detailsExp = await renderSinglePartyById(party.id);
        // console.log(`partyInfo is `);
        // console.log(partyInfo);
      });

      // delete party
      const deleteButton = partyElement.querySelector(".delete-button");
      deleteButton.addEventListener("click", async (event) => {
        // your code here
        await deleteParty(party.id);
        init();
      });
    });
  } catch (error) {
    console.error(error);
  }
};

// init function
const init = async () => {
  // your code here
  const partys = await getAllParties();

  renderParties(partys);
};

init();

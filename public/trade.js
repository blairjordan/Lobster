let player = '';
let target = '';
let server = 'http://localhost:3000';

const populateItems = (list, items, type = "") => {
  items.forEach(i => {
    list.append(
      `<li class="inventory-item" data-item-id="${i.item_id}"><a href="#"><span>${i.name} (item_id: ${
        i.item_id
      })</a></span>${(i.item_count)?' - qty:' + i.item_count : ''} ${
        type === "offer" ? `<a class="remove-item"  href="#">[-]</a></li>` : ""
      } ${type === "inventory" ? `<input class="qty" type="text" /><a class="add-item" href="#">[+] (trade/add_item)</a></li>` : ""}`
    );
  });
};

const populateOptions = (select, items) => {
  items.forEach(i => select.append(`<option value="${i.name}">${i.name}</option>`));
};

const updateStatus = (field, items) => {
  field.empty();
  if (items.length > 0) field.append(status, `[${items[0].target_status}]`);
};

const getItems = () => {
  $.ajax({
    url: `${server}/items/all`,
    method: "GET"
  }).done(function(items) {
    populateItems($("#all-items ul"), items);
  });
};

const getItemTypes = () => {
  $.ajax({
    url: `${server}/items/types`,
    method: "GET"
  }).done(function(types) {
    populateOptions($('#item-type-id'), types);
  });
};

const getInventory = () => {
  $.ajax({
    url: `${server}/items/find`,
    data: { player_name: player },
    method: "POST"
  }).done(function(items) {
    populateItems($('#inventory-items ul'), items, "inventory");
  });
};

const getOffers = () => {
  $.ajax({
    url: `${server}/trade/find`,
    data: { player_name: player },
    method: "POST"
  }).done(function(data) {
    if (data) {
      populateItems($("#my-offer-items ul"), data.source, "offer");
      populateItems($("#their-offer-items ul"), data.target);
      updateStatus($("#my-offer-status"), data.source);
      updateStatus($("#their-offer-status"), data.target);
    }
  });
};

const setOfferStatus = (source, target, status) => {
  $.ajax({
    url: `${server}/trade/update`,
    data: {
      source_player_name: source,
      target_player_name: target,
      status
    },
    method: "POST"
  }).done(function(data) {
    console.log(data);
  });
};

const removeOffer = (source, target) => {
  $.ajax({
    url: `${server}/trade/remove_offer`,
    data: {
      source_player_name: source,
      target_player_name: target
    },
    method: "POST"
  }).done(function(data) {
    console.log(data);
  });
};

const addOfferItem = (source, target, item_id, quantity) => {
  $.ajax({
    url: `${server}/trade/add_item`,
    data: {
      source_player_name: source,
      target_player_name: target,
      item_id,
      quantity
    },
    method: "POST"
  }).done(function(status) {
    if (status !== 'ADDED')
       alert(status);
    refresh();
  });
};

const acceptOffer = () => {
  setOfferStatus(target, player, "A");
};

const declineOffer = () => {
  removeOffer(target, player);
};

const openTrade = (source, target) => {
   $.ajax({
    url: `${server}/trade/add_offer`,
    data: {
      source_player_name: source,
      target_player_name: target
    },
    method: "POST"
  }).done(function(data) {
    console.log(data);
  });
};

const createItem = (name, type, description) => {
   $.ajax({
    url: `${server}/items/add`,
    data: {
      name,
      description,
      type
    },
    method: "POST"
  }).done(function(data) {
    alert(`New item created! (item_id: ${data.item_id})`);
  });
};

const refresh = () => {
  $("#inventory-items ul").empty();
  $("#my-offer-items ul").empty();
  $("#their-offer-items ul").empty();
  $('#all-items ul').empty();
  getInventory();
  getOffers();
  getItems();
  getItemTypes();
};

$(document).ready(function() {
  refresh();
  $('#server').append(server);
});

$("#open").on("click", () => {
  openTrade(player, target);
});

$("#refresh").on("click", () => {
  refresh();
});

$("#accept").on("click", () => {
  acceptOffer();
});

$('#decline').on('click', () => {
  declineOffer();
});

$('#create-item').on('click', () => {
   let type_id = $('#item-type-id').val();
   let name = $('#item-name').val();
   let desc = $('#item-desc').val();
   if (type_id && name && desc)
     createItem(name, type_id, desc);
   else
     alert('All fields are required.');
});

$(document).on('click', ".inventory-item .add-item", e => {
  let item_id = $(e.target.parentNode).data("itemId");
  let qty =  $(e.target.parentNode).children('input.qty').val();
  addOfferItem(player, target, item_id, qty);
});

$('#player').on('change', () => {player = $('#player').val();}); 
$('#target').on('change', () => {target = $('#target').val();});

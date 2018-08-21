let player = '';
let target = '';

const populateItems = (list, items, type = "") => {
  items.forEach(i => {
    list.append(
      `<li class="inventory-item" data-item-id="${i.item_id}"><a href="#"><span>${i.name} (item_id: ${
        i.item_id
      })</a></span> - qty: ${i.item_count} ${
        type === "offer" ? `<a class="remove-item"  href="#">[-]</a></li>` : ""
      } ${type === "inventory" ? `<input class="qty" type="text" /><a class="add-item" href="#">[+]</a></li>` : ""}`
    );
  });
};

const updateStatus = (field, items) => {
  field.empty();
  if (items.length > 0) field.append(status, `[${items[0].target_status}]`);
};

const getInventory = () => {
  $.ajax({
    url: "http://localhost:3000/items/find",
    data: { player_name: player },
    method: "POST"
  }).done(function(items) {
    populateItems($("#inventory-items ul"), items, "inventory");
  });
};

const getOffers = () => {
  $.ajax({
    url: "http://localhost:3000/trade/find",
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
    url: "http://localhost:3000/trade/update",
    data: {
      source_player_name: source,
      target_player_name: target,
      status: status
    },
    method: "POST"
  }).done(function(data) {
    console.log(data);
  });
};

const addOfferItem = (source, target, item_id, quantity) => {
  $.ajax({
    url: "http://localhost:3000/trade/add_item",
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

const refresh = () => {
  $("#inventory-items ul").empty();
  $("#my-offer-items ul").empty();
  $("#their-offer-items ul").empty();
  getInventory();
  getOffers();
};

$(document).ready(function() {
  refresh();
});

$("#refresh").on("click", () => {
  refresh();
});

$("#accept").on("click", () => {
  acceptOffer();
});

$(document).on('click', ".inventory-item .add-item", e => {
  let item_id = $(e.target.parentNode).data("itemId");
  let qty =  $(e.target.parentNode).children('input.qty').val();
  
  addOfferItem(player, target, item_id, qty);
});

$('#player').on('change', () => {player = $('#player').val();}); 
$('#target').on('change', () => {target = $('#target').val();}); 

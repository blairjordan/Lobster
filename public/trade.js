const player = 'blair';
const target = 'matt';

const populateItems = (list,items,type = '') => {
    items.forEach(i => {
    list.append(`<li><a href="#"><span>${i.name} (item_id: ${i.item_id})</a></span> - qty: ${i.item_count} ${type==='offer'?'<a href="#">[-]</a></li>':''} ${type==='inventory'?'<a href="#">[+]</a></li>':''}`);
    });
};

const updateStatus = (field, items) => {
  field.empty();
  if (items.length > 0)
    field.append(status, `[${items[0].target_status}]`);
};

const getInventory = () => {
  $.ajax({
    url:   'http://localhost:3000/items/find',
    data: { 'player_name' : player },
    method: 'POST'
  })
  .done(function( items ) {
    populateItems($('#inventory-items ul'), items, 'inventory');
  });
};

const getOffers = () => {
  $.ajax({
    url: 'http://localhost:3000/trade/find',
    data: { 'player_name' : player },
    method: 'POST'
  })
  .done(function( data ) {
    console.log( data );
    if (data) {
      populateItems($('#my-offer-items ul'), data.source, 'offer');
      populateItems($('#their-offer-items ul'), data.target);
      updateStatus($('#their-offer-status'), data.target);
    }
  });
};

const setOfferStatus = (source,target,status) => {
  $.ajax({
    url: 'http://localhost:3000/trade/update',
    data: { 'source_player_name' : source,
            'target_player_name' : target,
            'status' : status },
    method: 'POST'
  })
  .done(function( data ) {
    console.log( data );
  });
  
};

const acceptOffer = () => {
  setOfferStatus(target,player,'A');
  refresh();
};

const refresh = () => {
  $('#inventory-items ul').empty();
  $('#my-offer-items ul').empty();
  $('#their-offer-items ul').empty();
  
  getInventory();
  getOffers();
};

$( document ).ready(function() {
  refresh();  
});
  
$('#refresh').click(() => {
  refresh();
});

$('#accept').on('click', () => {
  acceptOffer();
});
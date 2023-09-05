var predefinedStores = [
    {
        lowercase: "Ciudad de México",
        stores: [],
        index: 0,
    },
    {
        lowercase: "Df",
        stores: [],
        index: 1,
    },
    {
        lowercase: "Estado de México",
        stores: [],
        index: 2,
    },
    {
        lowercase: "Aguascalientes",
        stores: [],
        index: 3,
    },
   /*  {
        lowercase: "Baja California",
        stores: [],
        index: 4,
    },
     {
        lowercase: "Chihuahua",
        stores: [],
        index: 5,
    },
    {
        lowercase: "Coahuila",
        stores: [],
        index: 6,
    },
    {
        lowercase: "Durango",
        stores: [],
        index: 7,
    },
     
    {
        lowercase: "Guerrero",
        stores: [],
        index: 9,
    },
     {
        lowercase: "Morelos",
        stores: [],
        index: 13,
    },
    {
        lowercase: "Oaxaca",
        stores: [],
        index: 15,
    },
     {
        lowercase: "Sonora",
        stores: [],
        index: 19,
    },
     {
        lowercase: "Veracruz",
        stores: [],
        index: 21,
    },
    {
        lowercase: "Zacatecas",
        stores: [],
        index: 22,
    },
    */
    
    {
        lowercase: "Guanajuato",
        stores: [],
        index: 4,
    },
    {
        lowercase: "Hidalgo",
        stores: [],
        index: 5,
    },
    
    {
        lowercase: "Jalisco",
        stores: [],
        index: 6,
    },
    {
        lowercase: "Michoacán",
        stores: [],
        index: 7,
    },
   
    {
        lowercase: "Nuevo León",
        stores: [],
        index: 8,
    },
    
    {
        lowercase: "Puebla",
        stores: [],
        index: 9,
    },
    {
        lowercase: "Querétaro",
        stores: [],
        index: 10,
    },
    {
        lowercase: "San Luis Potosí",
        stores: [],
        index: 11,
    },
   
    {
        lowercase: "Tlaxcala",
        stores: [],
        index: 12,
    },
    {
        lowercase: "Toluca",
        stores: [],
        index: 13,
    },
   
];

function getListCodesStates(options) {
    var listCodesState = [];
    if (options.lowercase) {
        listCodesState.push(options.lowercase);
    }
    if (options.capital) {
        listCodesState.push(options.capital);
    }
    if (options.abbreviation) {
        listCodesState.push(options.abbreviation);
    }
    return {
        listCodesState: listCodesState,
        index: options.index,
    };
}
function addStore(index, store) {
    var pos = 0;
    var stores = [];
    for (pos; pos < predefinedStores.length; pos++) {
        if (predefinedStores[pos].index === index) {
            stores = predefinedStores[index].stores;
            stores.push({
                id: store.ID,
                name: store.name,
                address: store.address1,
                city: store.city,
                state: store.stateCode,
                postalCode: store.postalCode,
                phone: store.phone,
                latitude: store.latitude,
                longitude: store.longitude,
            });
            predefinedStores[index].stores = stores;
        }
    }
}

function getStores(stores) {
    var pos = 0;
    var code = 0;
    var store = {};
    var codes = [];
    while (stores.hasNext()) {
        store = stores.next();
        for (pos = 0; pos < predefinedStores.length; pos++) {
            codes = getListCodesStates(predefinedStores[pos]);
            if (codes.listCodesState.length > 0) {
                for (code = 0; code < codes.listCodesState.length; code++) {
                    if (codes.listCodesState[code] === store.stateCode) {
                        addStore(codes.index, store);
                    }
                }
            }
        }
    }
    return predefinedStores;
}

module.exports = {
    getStores: getStores,
};

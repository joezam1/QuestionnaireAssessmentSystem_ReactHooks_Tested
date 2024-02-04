
const setItemStorage = function (key, value) {
    if(typeof(Storage) !== 'undefined'){
        window.localStorage.setItem(key, value);
    }
}

const getItemStorage = function(key){
    return window.localStorage.getItem(key);
}

const getKeyNameStorage = function(index){
    let keyName = window.localStorage.key(index);
    return keyName;
}

const removeItemStorage = function(key){
    window.localStorage.removeItem(key);
}

const clearAllItemsStorage = function(){
    window.localStorage.clear();
}

const LocalStorageHelper = Object.freeze({
    setItemStorage: setItemStorage,
    getItemStorage: getItemStorage,
    getKeyNameStorage: getKeyNameStorage,
    removeItemStorage: removeItemStorage,
    clearAllItemsStorage: clearAllItemsStorage
});
export default LocalStorageHelper;
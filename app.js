//  REMEMBER IIFE? THEY ARE FUNCTIONS THAT ARE INVOKED IMMEDIATELY A JS FILE IS RUN..

//  Storage Controller
const StorageController = (function(){
//  Public methods
return {
    storeItem: function(item){
        let items;
        //  Check if storage is empty
        if(localStorage.getItem('items') === null){
            items = [];
            //  Push new item
            items.push(item);
            //  Set local storage
            localStorage.setItem('items', JSON.stringify(items)); //LS only holds strings by default, so we turn objects in the array to strings
        }else{
            items = JSON.parse(localStorage.getItem('items')); //We convert to objects while retreiving from string form
            // Push new item
            items.push(item);
            //  Re set local storage
            localStorage.setItem('items', JSON.stringify(items));
        } 

    },
    getItemFromStorage: function(){
        let items;
        if(localStorage.getItem('items') === null){
            items = [];
        }else {
            items = JSON.parse(localStorage.getItem('items'));
        }
        return items;
    },
    updateItemStorage: function(updatedItem){
        let items = JSON.parse(localStorage.getItem('items'));
        items.forEach(function(item, index){
            if(updatedItem.id === item.id){
                items.splice(index, 1, updatedItem); //remove (start, increment, replace)
            }
        });
        localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
        let items = JSON.parse(localStorage.getItem('items'));
        items.forEach(function(item, index){
            if(id === item.id){
                items.splice(index, 1); 
            }
        });
        localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function(){
        localStorage.removeItem('items');
    }
}
})();

    //  Item Controller
    const ItemController = (function() {
            const Item = function(id, name, calories){
                this.id = id;
                this.name = name;
                this.calories = calories;
            }
            //  State
            const data = {
                // items: [
                //     // {id: 0, name: 'Steak Fries', calories: 2500},
                //     // {id: 1, name: 'Eggs', calories: 400},
                //     // {id: 2, name: 'Cookies', calories: 500},
                // ],
                items: StorageController.getItemFromStorage(),
                currentItem: null,
                totalCalories: 0
            }
            //  Public methods
            return {
                getItems: function() {
                    return data.items;
                },

                addItem: function(name, calories) {
                    let id;
                    // Create ID
                    if(data.items.length > 0){
                        id = data.items[data.items.length -1].id + 1;
                    }else{
                        id = 0;
                    }

                    //Calories to number
                    calories = parseInt(calories);

                    //  Create new item
                    newItem = new Item(id, name, calories);

                    //  Push the new item to the data array
                    data.items.push(newItem);

                    return newItem;
                },

                getItemById: function(id){
                    let found;

                    data.items.forEach(function(i){
                        if(i.id === id){
                            found = i;
                        }
                    });
                    return found;
                },

                updateItem: function(name, calories){
                    //  Calories to number
                    calories = parseInt(calories);

                    let found = null;

                    data.items.forEach(function(i){
                        if(i.id === data.currentItem.id){
                            i.name = name;
                            i.calories = calories;
                            found = i;
                        }
                    });
                    return found;
                },

                deleteItem: function(id){
                    //  Get Ids
                    const ids = data.items.map(function(item){
                        return item.id;
                    });

                    //  Get index
                    const index = ids.indexOf(id);
                    //  Remove item from array
                    data.items.splice(index, 1);
                },

                clearAllItems: function(){
                    //  set data array to empty
                    data.items = [];
                },


                setCurrentItem: function(item){
                    data.currentItem = item;
                },

                getCurrentItem: function(){
                    return data.currentItem;
                },

                getTotalCalories: function(){
                    let total = 0;
                    //  Loop through items for calories
                    data.items.forEach(function(i){
                        total += i.calories;
                    });
                    //  Set total cal in data structure
                    data.totalCalories = total;  

                    //  return total
                    return data.totalCalories;
                },

                logData: function() {
                    return data;
                }
            }
    })();



//  UI controller
const UIController = (function() {

const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCalorieInput: '#item-calories',
    caloriesAmount: '.caloriesAmount',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn'
}

//  Public methods
return{
    populateItemList: function(items) {
        let theList = '';

        items.forEach((item) => {
            theList += `
            <li class="collection-item" id="${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil-alt"></i>
            </a>
        </li>
            `;
        });
        document.querySelector(UISelectors.itemList).innerHTML = theList;
        },               
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCalorieInput).value
            }
        },
        addListItem: function(item){
            //  SHow the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //  Create li element
            const li = document.createElement('li');
            //  Add class
            li.className = 'collection-item';
            //  Add id
            li.id = `item-${item.id}`;
            //  Add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil-alt"></i>
            </a>`;
            //  Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //  convert node list into array
            listItems = Array.from(listItems);
            //  Loop through it
            listItems.forEach(function(i){
                const itemID = i.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil-alt"></i>
                    </a>`;
                }
            });            
        },
        deleteListItem: function(id){
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        clearInputs: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCalorieInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemController.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalorieInput).value = ItemController.getCurrentItem().calories;
            UIController.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //  Turn node list to array
            listItems = Array.from(listItems);

            //  Loop through
            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.caloriesAmount).textContent = totalCalories;
        },
        showEditState: function(){            
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        clearEditState: function(){
            UIController.clearInputs();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        getSelectors: function() {
            return UISelectors;
        }
}
})();



//  App Controller
const App = (function(ItemController, StorageController, UIController) //passed 
  {

//  Event LIsteners go here..
const loadEventListeners = function() {
    //  get ui selectors
    const UISelectors = UIController.getSelectors();

    //  Add item event              
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //  Disable submit on enter
    document.addEventListener('keypress', function(e){
        if(e.keyCode === 13 || e.which === 13){
            e.preventDefault();
            return false;
        }
    });

    //  Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //  Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

     //  Edit item event
     document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

     //  Edit item event
     document.querySelector(UISelectors.backBtn).addEventListener('click', UIController.clearEditState);

     // Clear items event
     document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    
}

//  Add itemAddsubmit
const itemAddSubmit = function(e) {
    //  Get input fields from UI contorller..
    const input = UIController.getItemInput();
    
    //  Check if form inputs are not empty..
    if(input.name !== '' && input.calories !== ''){
        //  Add Item
        const newItem = ItemController.addItem(input.name, input.calories);
        //  Add item to UI list
        UIController.addListItem(newItem);
        //  Get total calories
        const totalCalories = ItemController.getTotalCalories();
        //  Add total cal to UI
        UIController.showTotalCalories(totalCalories);
        //  Store in local storage
        StorageController.storeItem(newItem);
        //  Clear inputs
        UIController.clearInputs();
        //  Feedback to user
        alert('Item Added Successfully!');                
    }else {
        alert('Please enter item..');
    }
    
    e.preventDefault();
}

//  Edit item Submit
const itemEditClick = function(e) {
    // event delegation below...
   if(e.target.classList.contains('edit-item')){
        //  Get list item id..(item-0, item-1)
        const listId = e.target.parentNode.parentNode.id;
        //  Break into an array
        listArray = listId.split('-');
        //  Get the actual id
        const id = parseInt(listArray[1]);
        //  Get Item
        const itemToEdit = ItemController.getItemById(id);
        //  Set current item
        ItemController.setCurrentItem(itemToEdit);
        //  Add item to form
        UIController.addItemToForm();     
   }
    e.preventDefault();
}


//  Update item submit
    const itemUpdateSubmit = function(e) {
        //  Get item input
        const input = UIController.getItemInput();
        //  Update item in data structure
        const updatedItem = ItemController.updateItem(input.name, input.calories);
        //Update UI
        UIController.updateListItem(updatedItem);
         //  Get total calories
         const totalCalories = ItemController.getTotalCalories();
        //  Add total calorie to UI
        UIController.showTotalCalories(totalCalories);
        //  Update local storage
        StorageController.updateItemStorage(updatedItem);
        //  Clear inputs
        UIController.clearEditState();

        e.preventDefault();
    }

//  Delete Button event
const itemDeleteSubmit = function(e){
    //  get current item
    const currentItem = ItemController.getCurrentItem();

    //  Delete from data structure
    ItemController.deleteItem(currentItem.id);
    //  Delete from UI
    UIController.deleteListItem(currentItem.id);
    //  Get total calories
    const totalCalories = ItemController.getTotalCalories();
    //  Add total calorie to UI
    UIController.showTotalCalories(totalCalories);
    //  Delete from local storage
    StorageController.deleteItemFromStorage();
    //  Clear inputs
    UIController.clearEditState(currentItem.id);

    e.preventDefault();
}

const clearAllItemsClick = function(e){
    //  Delete all items from data structure
    ItemController.clearAllItems();
    //  Get total calories
    const totalCalories = ItemController.getTotalCalories();
    //  Add total calorie to UI
    UIController.showTotalCalories(totalCalories);
    //  Remove from UI
    UIController.removeItems();
    //  Clear from local storage
    StorageController.clearItemsFromStorage();
    //Hide the ul
    UIController.hideList();
}


//  Public methods
return {
    init: function() {
        //  Clear edit state / set initial state
        UIController.clearEditState();

        //  fetch items from array
        const items = ItemController.getItems();

        //  Check if any items
        if(items.length === 0) {
            UIController.hideList();
        }else{                    
            //  SHow them in DOM UI
            UIController.populateItemList(items);
        }              

        //  Get total calories
        const totalCalories = ItemController.getTotalCalories();
        //  Add total cal to UI
        UIController.showTotalCalories(totalCalories);  

        //  Load Event Listeners
        loadEventListeners();

    }
}
})(ItemController, StorageController, UIController); //invoked

App.init();
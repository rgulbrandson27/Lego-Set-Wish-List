
class Category {
    constructor(category) {
    this.category=category;
    this.LegoSets = [];
    }
    addLegoSet(name, price, pieces, year) {
        this.LegoSets.push(new this.LegoSet(name, price, pieces, year));
    }
}

class LegoSet {
    constructor(name, price, pieces, year) {
        this.name = name;
        this.price = price;
        this.pieces = pieces;
        this.year = year;
    }
}

// const myImage = new Image(100, 200);
// myImage.src = "picture.jpg";
// document.body.appendChild(myImage);



class CategoryService {
    static url="https://644435db914c816083b638ce.mockapi.io/LegoSets";
    
    static getAllCategories() {
        return $.get(this.url);
    }
    static getCategory(id) {
        return $.get(this.url + `/${id}`);
    }
    static createCategory(category) {
        return $.post(this.url, category);
    }
    static updateCategory(category) {
        return $.ajax({
            url: this.url + `/${category._id}`,
            dataType: 'json', 
            data: JSON.stringify(category), 
            contentType: 'application/json',
            type: 'PUT'
        });
    }
    static deleteCategory(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}
  
class DOMManager {
    static categories;

    static getAllCategories() {
        CategoryService.getAllCategories().then(categories => this.render(categories));
    }

    static createCategory(name) {
        CategoryService.createCategory(new Category(name))
            .then(() => this.render(categories));
    }

    static deleteCategory(id) {
        CategoryService.deleteCategory(id)
            .then(() => {
                return CategoryService.getAllCategories();
            })
            .then((categories) => this.render(categories));
    }

    static addLegoSet(id) {
        for (let category of this.categories) {
            if(category._id == id) {
                category.legoSets.push(new LegoSet(
                $(`#${category._id}-LegoSet-name`).val(), 
                $(`#${category._id}-LegoSet-price`).val(),
                $(`#${category._id}-LegoSet-pieces`).val(),
                $(`#${category._id}-LegoSet-year`).val()
                ));
                CategoryService.updateCategory(category)
                    .then(() => {
                        return CategoryService.getAllCategories();
                    })
                    .then((categories) => this.render(categories));
            }
        }
    }

    static deleteLegoSet(categoryId, legoSetId) {
        for (let category of this.categories) {
            if (category._id == categoryId) {
                for (let legoSet of category.legoSets) {
                    if (legoSet._id == legoSetId) {
                        category.legoSets.splice(category.legoSets.indexOf(legoSet), 1);
                        CategoryService.updateCategory(category)
                            .then(() => {
                                return CategoryService.getAllCategories();
                            })
                            .then((categories) => this.render(categories));
                    }
                }
            }
        }
    }

    static render(categories) {
        this.categories = categories;
        $('#app').empty();
        for (let category of categories) {
            $('#app').prepend(                                  //use prepend so newest shows up on top
                //html within the javaScript
                `<div id="${category._id}" class="accordion">
                    <div class="accordian-item">
                        <h2 class="accordion-header">${category.name}
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                        ${category.name}</button>
                        <button class= btn btn-danger" onclick="DOMManger.deleteCategory('${category._id}')">Delete</button>
                        </h2>
                        <div id="lsDetails" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${category._id}-ls-name" class="form-control" placeholder="Lego Set Name">
                                </div>
                                <div class="col-lg">
                                    <button id="${category._id}-new-legoSet" onclick=DOMManager.addLegoSet('${legoSet._id}')" class="btn btn-primary"</button>
                            </div>
                        </div>
                    </div><br>`
                
            );
                for (let legoSet of category.legoSets) {
                    $(`#${category._id}`).find('.accordion-item').append(
                        `<p>
                            <span id="name-${legoSet._id}"><strong>Name: </strong> ${legoSet.name}</span>
                            <span id="price-${legoSet._id}"><strong>Price: </strong> ${legoSet.price}</span>
                            <button class="btn btn-danger" onclick="DOMManager.deleteLegoSet('${category._id}', '${legoSet._id}')">Delete Lego Set</button>
                            );
                            `
                    )
                }
         
                
                                
                    }
        }
    }

    $('#create-category-button').onclick(() => {
        DOMManager.createCategory($('#new-category-name').val());
        $('#new-category-name').val('');
    });

    DOMManager.getAllCategories();
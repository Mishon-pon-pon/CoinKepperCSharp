const routers = {
    get: function (url) {
        return fetch(url, {
            method: 'GET'
        }).then(res => res.json());
    },
    post: function (url, body) {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
    },
    delete: function (url, id) {
        return fetch(url + `/${id}`, {
            method: 'DELETE'
        }).then(res => res.json());
    }
}

const CategoryController = {
    dataCache: [],
    update: function (data) {
        let highChartData = [];
        for (var i = 0; i < data.length; i++) {
            data[i]['input'] = 'input';
            if (data[i].Value !== 0) {
                highChartData.push({ name: data[i].name, y: data[i].Value })
            }
        }
        vue.categories = data;
        highChart('container', highChartData);
    },
    load: function (url) {
        routers.get(url)
            .then(categories => {
                //debugger;
                if (categories) {
                    for (var i = 0; i < categories.length; i++) {
                        this.dataCache.push(Object.assign(new Category(categories[i].name, categories[i].categoryId), new Sum(categories[i].value, categories[i].categoryId)));
                    }
                    this.update(this.dataCache);
                }
            });
    },
    save: function (url, newCategory) {
        routers.post(url, newCategory)
            .then(category => {
                this.dataCache.push(Object.assign(new Category(newCategory.name, category.categoryId), new Sum(0, category.categoryId)));
                this.update(this.dataCache);
            })
    },
    delete: function (url, id) {
        routers.delete(url, id)
            .then(id => {
                for (var i = 0; i < this.dataCache.length; i++) {
                    if (this.dataCache[i].CategoryId == id) {
                        this.dataCache.splice(i, 1);
                        this.update(this.dataCache);
                    }
                }
            })
    }
}

/* SumController */
const SumController = {
    dataCache: [],
    update: function (data) {
        this.dataCache = data;
        vueHistory.sums = this.dataCache;
    },
    load: function (url, id) {
        routers.get(url + `/${id}`)
            .then(res => {
                this.update(res);
            });
    },
    save: function (url, newSum) {
        routers.post(url, newSum)
            .then(sum => {
                if (sum) {
                    CategoryController.dataCache.forEach(item => {
                        if (item.CategoryId == sum.categoryId) {
                            item.Value += sum.value;
                        }
                    });
                }
                CategoryController.update(CategoryController.dataCache);
            });
    },
    delete: function (url, id) {
        routers.delete(url, id)
            .then(res => {
                for (let i = 0; i < this.dataCache.length; i++) {
                    if (this.dataCache[i].SumId == res.SumId) {
                        let Value = this.dataCache[i].Value;
                        this.dataCache.splice(i, 1);
                        for (let n = 0; n < CategoryController.dataCache.length; n++) {
                            if (CategoryController.dataCache[n].CategoryId == this.dataCache[0].CategoryId) {
                                CategoryController.dataCache[n].Value -= Value;
                            }
                        }
                    }
                    this.update(this.dataCache);
                    CategoryController.update(CategoryController.dataCache);
                }
            })
            .catch(err => { if (err) console.log(err) });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    CategoryController.load('/category/exist');
});

document.getElementById('addCategory').addEventListener('click', () => {
    let CategoryName = document.getElementById('categoryName').value;
    CategoryController.save('/category/isnew', new Category(CategoryName, 0));
    document.getElementById('categoryName').value = '';
});

document.getElementById('body').addEventListener('click', event => {
    if (event.target.getAttribute('button_delete')) {
        let CategoryId = event.target.getAttribute('button_delete');
        CategoryController.delete('/category/delete', CategoryId);
    }
    if (event.target.getAttribute('button_addSum')) {
        let CategoryId = event.target.getAttribute('button_addSum');
        let Value = document.getElementById('input' + CategoryId).value;
        if (Value) {
            SumController.save('/sum/isNew', new Sum(Value, CategoryId))
            document.getElementById('input' + CategoryId).value = '';
        }
    }
    if (event.target.getAttribute('button_getSumHistory')) {
        let CategoryId = event.target.getAttribute('button_getSumHistory');
        SumController.load('/sum/category', CategoryId);
    }
    if (event.target.getAttribute('button_rowEdit')) {
        let SumId = event.target.getAttribute('button_rowEdit');
        $('[button_rowEdit = "' + SumId + '"]').toggle('hiden');
        $('[button_rowSave = "' + SumId + '"]').toggle('hiden');
        // $('[editRow_spanDate = "' + SumId + '"]').toggle('hiden');
        // $('[editRow_spanValue = "' + SumId + '"]').toggle('hiden');
        // $('[editRow_inputDate = "' + SumId + '"]').toggle('hiden');
        // $('[editRow_inputValue = "' + SumId + '"]').toggle('hiden');
        let date = $('[editRow_spanDate = "' + SumId + '"]').text();
        let value = $('[editRow_spanValue = "' + SumId + '"]').text();
        // $('[editRow_inputDate = "' + SumId + '"]').val(date);
        // $('[editRow_inputValue = "' + SumId + '"]').val(value);
        $('[editRow_inputDate = "' + SumId + '"]').prop('disabled', false);
        $('[editRow_inputValue = "' + SumId + '"]').prop('disabled', false);
    }
    if (event.target.getAttribute('button_rowSave')) {
        let SumId = event.target.getAttribute('button_rowSave');
        $('[button_rowEdit = "' + SumId + '"]').toggle('hiden');
        $('[button_rowSave = "' + SumId + '"]').toggle('hiden');
        // $('[editRow_spanDate = "' + SumId + '"]').toggle('hiden');
        // $('[editRow_spanValue = "' + SumId + '"]').toggle('hiden');
        // $('[editRow_inputDate = "' + SumId + '"]').toggle('hiden');
        // $('[editRow_inputValue = "' + SumId + '"]').toggle('hiden');
        $('[editRow_inputDate = "' + SumId + '"]').prop('disabled', true);
        $('[editRow_inputValue = "' + SumId + '"]').prop('disabled', true);
    }
    if (event.target.getAttribute('button_deleteSum')) {
        let SumId = event.target.getAttribute('button_deleteSum');
        SumController.delete('/sum/delete', SumId);
    }
});

const vue = new Vue({
    el: '#CategoriesDivContent',
    data: {
        categories: []
    }
});

const vueHistory = new Vue({
    el: '#historyOperationDivContent',
    data: {
        sums: []
    }
});

function Category(name, id) {
    this.name = name;
    this.categoryId = id;
}

function Sum(value, categoryId, id) {
    this.id = id;
    this.Value = value;
    this.CategoryId = categoryId;
}

function highChart(elementId, chartData) {
    return Highcharts.chart(elementId, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Ваши траты в процентах к общей сумме'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Вы потратили',
            colorByPoint: true,
            data: chartData
        }]
    });
}
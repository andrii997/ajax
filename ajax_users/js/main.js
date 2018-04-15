var $table = $("tbody"),
    $btnCreate = $("#create"),
    $btnSave = $(".btn-save"),
    $input = $("input");
$form = $("form");
$btnCreate.get(0).on = false;


loadList();
sendForm();
removehendler();
edithendler();

function loadList() {
    var xhr = new XMLHttpRequest();
    xhr.open("get","user");
    xhr.send();
    xhr.responseType = "json";

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState !== this.DONE) {
            return;
        }
        $table.empty();

        for (i=0; i< this.response.length;i++){
            var
                userData=this.response[i],
                tr = document.createElement("tr"),
                name = document.createElement("td"),
                prof = document.createElement("td"),
                info = document.createElement("td"),
                btnRemove = document.createElement("button"),
                btnEdit = document.createElement("button"),
                options = document.createElement("td");

            tr.classList.add("tr-data");
            tr.data = userData;

            name.textContent = userData.fullName;
            prof.textContent = userData.profession;
            info.textContent = userData.shortInfo;
            btnEdit.textContent = "Edit";
            btnRemove.textContent = "Remove";
            btnRemove.classList.add("btn-remove");
            btnEdit.classList.add("btn-edit");
            options.append(btnRemove);
            options.append(btnEdit);
            tr.append(name);
            tr.append(prof);
            tr.append(info);
            tr.append(options);
            $table[0].append(tr);
        }

    })
}

function sendForm() {

    $("#cancel").on("click",function () {
        $form.get(0).classList.add("users-edit-hidden");
    });

    $btnCreate.on("click", function (){
        $form.get(0).classList.remove("users-edit-hidden");
        this.on = true;
    });

    $form.on("submit", function (e) {
        e.preventDefault();
        var thisForm = writeDataFromForm(),
            xhr= new XMLHttpRequest();


        if ($btnCreate.get(0).on){
            xhr.open("post","user");
        }
        else {
            xhr.open("put", "user?id=" + $btnCreate.get(0).dataId);
        }
        var formToSend = JSON.stringify(thisForm);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(formToSend);
        if (this.readyState!== this.DONE){
            return;
        }
        $form.trigger('reset');
        $btnCreate.get(0).on = false;
        $btnCreate.get(0).dataId = "";
        $form.get(0).classList.add("users-edit-hidden");
        loadList();
    });

}

function removehendler() {
    $table.on("click",".btn-remove", function () {

        var $remove = $(this).parents(".tr-data").get(0);
        var xhr = new XMLHttpRequest();
        xhr.open("delete", "user?id=" + $remove.data.id);
        xhr.send();
        xhr.addEventListener("readystatechange", function () {
            if (xhr.readyState!== this.DONE){
                return;
            }

            if ( this.status !== 200){
                alert("Somesing wrong")
            } else {
                $remove.remove();
            }
            loadList();
        })
    })
}

function edithendler() {
    $table.on("click",".btn-edit", function () {

        var $edit = $(this).parents(".tr-data").get(0);
        var xhr = new XMLHttpRequest();
        $btnCreate.get(0).dataId = $edit.data.id;

        $("#fullname").get(0).value = $edit.data.fullName;
        $("#birthday").get(0).value =$edit.data.birthday;
        $("#profession").get(0).value = $edit.data.profession;
        $("#short-info").get(0).value = $edit.data.shortInfo;
        $("#address").get(0).value = $edit.data.address;
        $("#full-info").get(0).value = $edit.data.fullInfo;
        $("#country").get(0).value = $edit.data.country;
        $form.get(0).classList.remove("users-edit-hidden");
    })
}

function writeDataFromForm() {
    var data = new Object();
    data.fullName = $("#fullname").get(0).value;
    data.birthday = $("#birthday").get(0).value;
    data.profession = $("#profession").get(0).value;
    data.shortInfo = $("#short-info").get(0).value;
    data.address = $("#address").get(0).value;
    data.fullInfo = $("#full-info").get(0).value;
    data.country = $("#country").get(0).value;
    if ($btnCreate.get(0).dataId){
        data.id =$btnCreate.get(0).dataId;
    }
    return data;

}
/**
 * Created by akv on 8/14/16.
 */
var
    $template = $(".list-group-item.template"),
    $todoListEl = $(".list-group"),
    $todoForm = $("form");

loadTodoList();
attachRemoveHandler();
attachUnfinishHandler();
attachFinishHandler();
attachAddHandler();

function loadTodoList() {
    var
        xhr = new XMLHttpRequest();

    xhr.open("get", "/api/todo");
    xhr.responseType = "json";
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
       if (this.readyState !== this.DONE) {
           return;
       }
      for (var i = 0; i < this.response.length; i++) {
           var
               $clone = $template.clone();
               curr = this.response[i];

               $clone.get(0).__source = curr;
               $clone.attr("id", curr.id);
               $clone.find(".list-group-item-heading").text(curr.title);
               $clone.find(".list-group-item-text .desc").text(curr.value);
          if (curr.done) {
              $clone.find(".list-group-item-text strong").text(curr.finishedOn);
              $clone.find(".btn.btn-success").remove();
              $clone.addClass("list-group-item-success");
          } else {
              $clone.find(".btn.btn-default").remove();
          }

           $clone.appendTo($todoListEl);
           $clone.show();
      }
    });
}

function attachRemoveHandler() {
    $todoListEl.on("click", ".btn.btn-danger", function () {
       var $listItem = $(this).parents(".list-group-item");

       var xhr = new XMLHttpRequest();
       xhr.open("delete", "/api/todo?id=" + $listItem.attr("id"));
       xhr.send();
       xhr.addEventListener("readystatechange", function () {
           if (this.readyState !== this.DONE) {
               return;
           }

           if (this.status !== 200) {
               alert("something wrong");
           } else {
               $listItem.remove();
           }
       })
    });
}

function attachUnfinishHandler() {
    $todoListEl.on("click", ".btn.btn-default", function () {
        var $listItem = $(this).parents(".list-group-item");

        var xhr = new XMLHttpRequest();
        xhr.open("put", "/api/todo");
        var data = $listItem.get(0).__source;
        data.done = false;
        data.finishedOn = null;
        var dataToSend = JSON.stringify(data);

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(dataToSend);
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState !== this.DONE) {
                return;
            }

            $todoListEl.empty();
            loadTodoList();
        });
    });
}

function attachFinishHandler() {
    $todoListEl.on("click", ".btn.btn-success", function () {
        var $listItem = $(this).parents(".list-group-item");

        var xhr = new XMLHttpRequest();
        xhr.open("put", "/api/todo");
        var data = $listItem.get(0).__source;
        data.done = true;
        data.finishedOn = new Date();
        var dataToSend = JSON.stringify(data);

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(dataToSend);
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState !== this.DONE) {
                return;
            }

            $todoListEl.empty();
            loadTodoList();
        });
    });
}


function attachAddHandler() {
    $todoForm.on("submit", function () {
        var
            xhr = new XMLHttpRequest();
        xhr.open("post", "/api/todo");

        var thisForm = $listItem.get(0).__form;
        thisForm.title = $("#title").get(0).__form.value;
        thisForm.value = $("#desc").get(0).__form.value;
        thisForm.done = false;
        thisForm.finishedOn = new Date();
console.log(thisForm);
        if ($("#finished").get(0).checked){
            thisForm.done = true;
        } else {
            thisForm.done = false;
        }

        var dataToSend = JSON.stringify(data);

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(dataToSend);

        xhr.addEventListener("readystatechange", function () {
            if (xhr.readyState!== this.DONE){
                return;
            }

            $todoListEl.empty();
            loadTodoList();
        })
    })

}



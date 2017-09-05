const STORE_KEY="myTaskList";
var storage={
    save:function(val){
        window.localStorage.setItem(STORE_KEY,JSON.stringify(val));
    },
    fetch:function(){
        return JSON.parse(window.localStorage.getItem(STORE_KEY))||[];
    }
};
var state={
    all:function(list){
        console.log(1);
        $('a[href="#all"]').parent()
        .addClass('active').siblings().removeClass('active');
        return list;
    },
    finished:function(list){
        console.log(2);
        $('a[href="#finished"]').parent()
        .addClass('active').siblings().removeClass('active');
        return list.filter(function(item){
            return item.isChecked;
        });
    },
    unfinished:function(list){
        console.log(3);
        $('a[href="#unfinished"]').parent()
        .addClass('active').siblings().removeClass('active');
        return list.filter(function(item){
            return !item.isChecked;
        });
    }
};

var now=new Date();
var beforeTime=now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate();

var list=storage.fetch();
var vm=new Vue({
    el:"#main",
    data:{
        list:list,
        addTodo:'',
        editable:'',
        beforeEdit:'',//修改前
        visibility:'all',
        date:now
    },
    methods:{
        addList:function(){
            this.list.push({
                text:this.addTodo,
                isChecked:false,
                time:this.date
            });
            this.addTodo='';
        },
        deleteTodo:function(todo){
            var index=this.list.indexOf(todo);
            var _this=this;
            _this.list.splice(index,1);
        },
        editTodo:function(todo){
            this.beforeEdit=todo.text;
            this.editable=todo;
        },
        complete:function(){
            this.editable='';
        },
        cancelEdit:function(item){
            item.text=this.beforeEdit;
            this.editable='';
        }
    },
    computed:{
        unfinished:function(){
            return this.list.filter(function(item){
                return !item.isChecked;
            }).length;
        },
        finished:function(){
            return this.list.filter(function(item){
                return item.isChecked;
            }).length;
        },
        filterList:function(){
            console.log(this.visibility)
            return state[this.visibility]?state[this.visibility](list):list;
        }
    },
    watch:{
        list:{
            handler:function(){
                storage.save(this.list);
            },
            deep:true
        },
        date:{
            handler:function(){
                if(this.date!=beforeTime){
                    for(var i=0;i<this.list.length;i++){
                        console.log(5)
                        this.list[i].isChecked=false;
                    }
                }
            },
            deep:false
        }
    }
});

function watchHashChange(){
    var hash=window.location.hash.slice(1);
    vm.visibility=hash;
}
function createTime(){
    var time=new Date();
    vm.date=time.getFullYear()+'/'+(time.getMonth()+1)+'/'+time.getDate();
}
createTime();
setInterval(createTime,500);
watchHashChange();
window.addEventListener('hashchange',watchHashChange);

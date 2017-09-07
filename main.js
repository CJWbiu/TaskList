const STORE_KEY="myTaskList";
var storage={   //localStorage
    save:function(val){
        window.localStorage.setItem(STORE_KEY,JSON.stringify(val));
    },
    fetch:function(){
        return JSON.parse(window.localStorage.getItem(STORE_KEY))||[];
    }
};
var state={ //切换视图
    all:function(list){
        // console.log(1);
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
if(typeof localStorage.getItem('myStyle')!='string'){   //初始化主题
    localStorage.setItem('myStyle','{"isBlack":false}');
}

console.log(mystyle)
var msg="内容不能为空！";
var now=new Date();
var beforeTime=now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate();

var times={ 
    hours:now.getHours(),
    minutes:now.getMinutes(),
    second:now.getSeconds()
};

var list=storage.fetch();
var mystyle=JSON.parse(localStorage.getItem('myStyle')).isBlack;
var vm=new Vue({
    el:"#main",
    data:{
        myTime:beforeTime,
        list:list,
        msg:false,
        addTodo:'',
        editable:'',
        beforeEdit:'',//修改前
        visibility:'all',
        date:'',
        isBlack:mystyle,
        long:1,
        clickedTime:{'timeA':'','timeB':''}
    },
    methods:{
        addList:function(){ //添加任务
           
            if(this.addTodo==''){
                this.msg=true;
                this.myTime=msg;
            }else{
                this.list.push({
                    text:this.addTodo,
                    isChecked:false,
                    time:this.date
                });
                this.addTodo='';
                this.msg=false;
                this.myTime=beforeTime;
            }
            
        },
        deleteTodo:function(todo){  //删除任务
            var index=this.list.indexOf(todo);
            var _this=this;
            _this.list.splice(index,1);
        },
        complete:function(){    //完成编辑
            this.editable='';
        },
        cancelEdit:function(item){  //取消编辑
            item.text=this.beforeEdit;
            this.editable='';
        },
        changeStyle:function(){ //切换主题
            this.isBlack=!this.isBlack;
            localStorage.setItem('myStyle',JSON.stringify({isBlack:this.isBlack}));
        },
        touch:function(todo){   //模拟双击
            if(this.long==1){
                this.clickedTime.timeA=new Date();
                this.long++;
            }else if(this.long==2){
                // console.log(1);
                this.clickedTime.timeB=new Date();
                if(Math.abs(this.clickedTime.timeA-this.clickedTime.timeB)<400){
                    this.beforeEdit=todo.text;
                    this.editable=todo;
                }else{
                    this.clickedTime.timeA=new Date();
                }
            }
        },
        hideMsg:function(){ //隐藏提示框
            this.msg=false;
            this.myTime=beforeTime;
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
            // console.log(this.visibility)
            return state[this.visibility]?state[this.visibility](list):list;
        }
    },
    watch:{
        list:{
            handler:function(){
                storage.save(this.list);
            },
            deep:true
        }
    }
});

function watchHashChange(){
    var hash=window.location.hash.slice(1);
    vm.visibility=hash;
}
function createTime(){  //更新时间
    var time=new Date();
    vm.date=time.getFullYear()+'/'+(time.getMonth()+1)+'/'+time.getDate();
    times.hours=time.getHours();
    times.minutes=time.getMinutes();
    times.second=time.getSeconds();
    // console.log(times)
    if(times.hours==0 && times.minutes==0 && times.second==0){  //0点0分0秒更新
       console.log(1)
        for(var i=0;i<vm.list.length;i++){
            
            vm.list[i].isChecked=false; //刷新任务
        }
    }
}
createTime();
setInterval(createTime,500);
watchHashChange();
window.addEventListener('hashchange',watchHashChange);//监听hash值的变化

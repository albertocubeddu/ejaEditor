function Editor(file,path){
   
   this.createHtml();
   this.textLoaded = file;
   this.path = path;
   
   this.selectFile = $("#selectFile");
   this.btnSave = $("#btnSave");
   this.btnIndent = $("#btnIndent");
   
   this.createSelect();
   
   this.editor = ace.edit("editor");
   this.editor.$blockScrolling = Infinity
   this.editor.setTheme("ace/theme/monokai");
   this.editor.getSession().setMode("ace/mode/json");
   this.editor.getSession().setTabSize(3);
   this.editor.setBehavioursEnabled(false);
   this.editor.setShowPrintMargin(false);
   this.editor.gotoLine(1, 1, false);
   this.editor.focus();
   
   this.editor.resize()
   
   //Trigger
   this.onSelectChange();
   this.onBtnIndentClick();
   this.onBtnSaveClick();
   
   this.selectFile.change();
   
}

Editor.prototype = {
   constructor: Editor
}


//////////////
// CREATION
/////////////

Editor.prototype.createHtml = function(){
   $("body").append("<select id='selectFile'></select><button type='button' id='btnSave'>Save!</button><button type='button' id='btnIndent'>Indent!</button><div id='editor'></div><span class='warning'></span>");
}


Editor.prototype.createSelect = function(){       
   
   for (i=0; i<this.textLoaded.length; i++){
      
      if(i==0 && this.textLoaded.length != 1){
         $("#selectFile").append("<option value=''>New File</option>");
      }
      
      $("#selectFile").append("<option value='"+this.textLoaded[i]+"'>"+this.textLoaded[i]+"</option>");
   } 
}

//////////////
// UTILITY EDITOR
/////////////

Editor.prototype.textIndent = function(){
   var text = this.editor.getValue();
   
   this.editor.selectAll();
   this.editor.remove();
   
   self = this;
   setTimeout(function(){
      for (var i = 0; i <= text.length-1; i++) {
         if(text[i].match(/\n/)){
            self.editor.insert(text[i]);
            while(text[i+1] == " "){
               i++;
            }
         }else{
            self.editor.insert(text[i]);
         }
      }
   },100);
}

///////////////
// TRIGGER ON....
///////////////

Editor.prototype.onBtnIndentClick = function(){
   self=this;
   this.btnIndent.click(function(){
      self.textIndent();
   })
}

Editor.prototype.onBtnSaveClick = function(){
   self=this;
   this.btnSave.click(function(){ 
      // Press save with NEW FILE
      if (self.selectFile.val() == '' && !($(".insertFileName").length)) {
         $(this).after("<input type='text' class='insertFileName'></input>");
         $(".warning").html("Insert Name and press Save");
         
      }else if (self.selectFile.val() =='' && $(".insertFileName").length){  
         if(($(".insertFileName").val().length && ($(".insertFileName").val().trim()))) {
            var content = self.editor.getValue();
            if (!content.length){
               content="File Empty";
            }
            $.ajax({
               url: this.path+"?fileWriteNew="+($(".insertFileName").val()),
               data: content,
               cache: false,
               contentType: 'multipart/form-data',
               processData: false,
               type: 'POST',
               success: function(data,status) { 
                  if (data=="error_extension"){
                     $(".warning").html("Extension NOT VALID!"); 
                  }else if (data=="error_fileExist"){
                     $(".warning").html("File Already Exist!"); 
                  }else{
                     $(".warning").html("File Saved").show(1).delay(5000).hide();
                     $(self.selectFile).append("<option value='"+$(".insertFileName").val()+"'>"+$(".insertFileName").val()+" </option");
                     $(self.selectFile).val($(".insertFileName").val()).change();    
                     $(".insertFileName").remove();
                  }
               }
            });
         }
      }else{
         $.ajax({
            url: this.path+"?fileWrite="+self.selectFile.val(),
            data: self.editor.getValue(),
            cache: false,
            contentType: 'multipart/form-data',
            processData: false,
            type: 'POST',
            success: function(data,status) { 
               console.log("Asd");
               $(".warning").html("File Saved").show(1).delay(3000).hide(1);
            }
         });
      }
   })
}

Editor.prototype.onSelectChange = function(){
   self=this;
   this.selectFile.on("change",function(){
      
      self.editor.selectAll();
      self.editor.remove();

      var text = self.getRemote(this.value);
      if(text){
         var ext = self.stringSplit(this.value);
         
         switch(ext){
            case "js":
               self.editor.getSession().setMode("ace/mode/javascript");
               break;
               
               case "json":
                  self.editor.getSession().setMode("ace/mode/json");
               break;
                  
               case "eja":
               case "lua":
                  self.editor.getSession().setMode("ace/mode/lua");
               break;
               
               case "html":
               case "htm":
                  self.editor.getSession().setMode("ace/mode/html");
               break;
         }
         
         self.editor.gotoLine(1, 1, true);
         self.editor.insert(text);
         self.editor.gotoLine(1, 1, true);
      }else{
         self.editor.insert("File Empty");
      }
   })
}

///////////////
// UTILITY JS
///////////////

Editor.prototype.getRemote = function (){
   var result=0;
   if (this.selectFile.val() != ""){
      $.ajax({
         url: this.path+"?fileRead="+this.selectFile.val(),
         data: this.editor.getValue(),
         cache: false,
         async: false,
         processData: false,
         type: 'POST',
      }).done(function(data){
         result=data;
      }).fail(function(){
         result=false;
      });
      return result;
   }
}

Editor.prototype.stringSplit = function(str){
   var res = str.split(".");
   return res[1];
}



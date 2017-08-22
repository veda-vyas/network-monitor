const remote = require('electron').remote
const main = remote.require('./main.js')

var mainwindow = {
  init: function(){
    /*
     * Create an Update Button
     */
    this.updatebutton = document.createElement('button')
    this.updatebutton.textContent = "Show Updates"
    this.updatebutton.className = "btn btn-default"
    
    /*
     * Add an onclick listener
     */
    this.updatebutton.addEventListener('click', () => {
      const {ipcRenderer} = require('electron');
      ipcRenderer.send('show-updates');
    }, false)
    
    /*
     * render the content on screen
     */
    this.render()
  },
  render: function() {
    document.getElementById("updatefield").appendChild(this.updatebutton);
    userdetails.init();
  }
}

var userdetails = {
  init: function(){
    
    /*
     * Create a Form which takes 
     *  # Roll Number 
     * and sends a request to <endpoint> to save an entry.
     */
     this.form = document.createElement('div');

     /*
     * Add a specific field using addField(label,type,id) function.
     */
     var field = this.addField("Roll Number","text","rno");
     this.form.appendChild(field);

     /*
     * Create a Submit Button
     */
      this.submitbutton = document.createElement('button')
      this.submitbutton.textContent = "Submit"
      this.submitbutton.className = "btn btn-success"
      
      /*
       * Add an onclick listener
       */
      this.submitbutton.addEventListener('click', () => {
        const {ipcRenderer} = require('electron');
        ipcRenderer.send('save-and-report',{"rollno":$("#rno").val(),"timestamp":Date.now()});
      }, false)

      this.form.appendChild(this.submitbutton)
     /*
     * render the content on screen
     */
     this.render();
  },
  addField: function(label,type,id){
    var div = document.createElement('div');
    div.className = "form-group";
    var labelelement = document.createElement('label');
    labelelement.htmlFor = id;
    labelelement.textContent = label;
    var input = document.createElement('input');
    input.type = type;
    input.className = "form-control"
    input.id = id;
    div.appendChild(labelelement);
    div.appendChild(input);

    return div;
  },
  render: function(){
    document.getElementById("content").appendChild(this.form);
    var br = document.createElement('br');
    document.getElementById("content").appendChild(br);
  }
}

/*
 * Initialize the autoupdate functionality
 */
mainwindow.init()
var util = require('util');
var ee = require('events');


var db_data = [
    {id: 1, name: 'Иванов И. И.', bday:'2001-01-01'},
    {id: 2, name: 'Петров П. П.', bday:'2001-01-02'},
    {id: 3, name: 'Александрович И. А.', bday:'2001-01-03'}
];

function DB()
{
    this.get = ()=>{return db_data;};   
    this.post = (r)=> {
        if(db_data.findIndex(i => i.id == r.id) == -1)
            db_data.push(r);
    };
    this.put = (r, id) => {
        var index = db_data.findIndex(item => item.id == id);
        if (index != -1) 
        {
            db_data[index] = { ...db_data[index], ...r };
            return true; 
        }
        return false; 
    };
    
    this.delete = (id) => {
        var index = db_data.findIndex(item => item.id == id);
        if (index != -1) {
            db_data.splice(index, 1); 
            return true;
        }
        return false; 
    };
}


util.inherits(DB, ee.EventEmitter);

exports.DB = DB;
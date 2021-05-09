/**
 * render a the startpage
 */

 import User from './User'

 //import './Info.css';
 
 function Info({users, globals, conferences, conferencetypes, info}) {
     return (
         <div>
             {
                 users.map(usr => <User key={usr.id} data={usr}/>)
             }
         </div>
     )
 }
 
 export default Info;
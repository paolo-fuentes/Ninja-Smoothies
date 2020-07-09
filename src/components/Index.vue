<template>
  <div class="index container">
    <div class="card" v-for="smoothie in smoothies" :key="smoothie.id">
      <i class="material-icons delete" @click="deleteSmoothie(smoothie.id)">delete</i>
      <div class="card-content">
        <h2 class="indigo-text">{{ smoothie.title }}</h2>
        <ul class="ingredients">
          <li v-for="(ing, index) in smoothie.ingredients" :key="index">
            <span class="chip">{{ ing }}</span>
          </li>
        </ul>
      </div>
      <span class="btn-floating btn-large halfway-fab pink">
        <router-link :to="{ name: 'EditSmoothie', params: {smoothie_slug: smoothie.slug} }">
          <i class="material-icons edit">edit</i>
        </router-link>
      </span>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init" // firestore is the db

export default {
  name: 'Index',
  data () {
    return {
     smoothies: [] //storage for stuff from db
    }
  },
  methods: {
    deleteSmoothie(id){
      //delete doc from firestore
      db.collection('smoothies').doc(id).delete()
      .then(() => {
        this.smoothies = this.smoothies.filter(smoothie => {
          return smoothie.id != id // if true, smoothie will be deleted
        })
      })
    }
  },
  created(){
  //fetch data from the firestore
    db.collection('smoothies').get()
    .then(snapshot => { //state of smoothies collection at that point in time
      snapshot.forEach(doc => { //doc is an ibj that has lots of properties. we only need the data which is equal to elements needed in the smoothie array
        let smoothie = doc.data()
        smoothie.id = doc.id //id is part of doc, not doc.data
        this.smoothies.push(smoothie) //smoothies is the array above
      })
    })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.index {
  display: grid; /* cards sit next to each other */
  grid-template-columns: 1fr 1fr 1fr; /*3 columns; each column will take 1fr/33% */
  grid-gap: 30px;
  margin-top: 60px;
}

.index h2 {
  font-size: 1.8em;
  text-align: center;
  margin-top: 0;
}

.index .ingredients {
  margin: 30px auto;
}

.index .ingredients li{
  display: inline-block; /* ing sit next to each other */
}

.index .delete{
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: #aaa;
  font-size: 1.4em;
}
</style>

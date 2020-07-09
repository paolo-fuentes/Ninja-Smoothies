<template>
    <div class="edit-smoothie container" v-if="smoothie"> <!-- output only if smoothie has content from db already -->
        <h2>Edit {{smoothie.title}} Smoothie</h2>

        <form @submit.prevent="EditSmoothie"> <!--.prevent is a modifier that prevents from redirecting -->
        <div class="field title">
            <label for="title">Smoothie Title:</label>
            <input type="text" name="title" v-model="smoothie.title">
        </div>

        <div v-for="(ing, index) in smoothie.ingredients" :key="index" class="field">
            <label for="ingredient">Ingredient</label>
            <input type="text" name="ingredient" v-model="smoothie.ingredients[index]"> <!--when we use v-model we have to bind to data in the component -->
            <i class="material-icons delete" @click="deleteIng(ing)">delete</i> <!-- form ing in v-for -->
        </div>
        <div class="field add-ingredient">
            <label for="add-ingredient">Add an Ingredient:</label>
            <input type="text" name="add-ingredient" @keydown.tab.prevent="addIng" v-model="another"> <!-- .tab is a modifier ; .tab.prevent prevents moving to another input field aka we will still be in the active input field-->
        </div>

        <div class="field center-align">
            <p v-if="feedback" class="red-text">{{ feedback }} </p>
            <button class="btn pink">Update Smooothie</button>
        </div>
    </form>
    </div>
</template>

<script>
import db from '@/firebase/init'
import slugify from 'slugify'

export default {
    name: "Edit Smoothie",
    data(){
        return {
            smoothie: null, //this is an object; store smoothie here retrieved from db
            another: null,
            feedback: null
        }
    },
    methods: {
        EditSmoothie(){
            //if user has created a title
            if(this.smoothie.title){ //if not null
                this.feedback = null
                //create slug
                this.smoothie.slug = slugify(this.smoothie.title, { //we use slugify package
                    replacement: '-',
                    remove: /[$*_+.()'"!\-:@]/g, // g means remove globally
                    lower: true //lowercase everything
                })
                db.collection('smoothies').doc(this.smoothie.id).update({ //.doc reaches out to an object in db via its id; smoothie.id is from created below
                    title: this.smoothie.title,
                    ingredients: this.smoothie.ingredients,
                    slug : this.smoothie.slug
                }).then(() => {
                    this.$router.push({name: 'Index'})
                }).catch(err => {
                    console.log(err)
                })
            }
            else{
                this.feedback = "You must enter a smoothie title"
            }
        },
        addIng(){
            if(this.another){ //add only if this.another is not null
                this.smoothie.ingredients.push(this.another) //this.another is value of input
                this.another = null //clears input field
                this.feedback = null // feedback doesnt show up 
            }
            else{
                this.feedback = "You must enter a value to add an ingredient"
            }
        },
        deleteIng(ing){
            this.smoothie.ingredients = this.smoothie.ingredients.filter(ingredient => {
                return ingredient != ing //filter out/delte if false
            })
        }
    },
    created(){ //renders when component is created but not yet rendered to DOM
        let ref = db.collection('smoothies').where('slug', '==', this.$route.params.smoothie_slug)
        ref.get().then(snapshot => {
            snapshot.forEach(doc => {
            this.smoothie = doc.data()
            this.smoothie.id = doc.id    
            })
        })
    }
}
</script>

<style>
.edit-smoothie {
    margin-top: 60px;
    padding: 20px;
    max-width: 500px;
}

.edit-smoothie h2 {
    font-size: 2em;
    margin: 20px auto;
}

.edit-smoothie .field {
    margin: 20px auto;
    position: relative;
}

.edit-smoothie .delete {
    position: absolute;
    right: 0;
    bottom: 16px;
    color: #aaa;
    font-size: 1.4em;
    cursor: pointer;
}
</style>
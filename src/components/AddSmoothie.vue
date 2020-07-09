<template>
<div class="add-smoothie container">
    <h2 class="center-align indigo-text">Add New Smoothie Recipe</h2>

    <form @submit.prevent="AddSmoothie"> <!--.prevent is a modifier that prevents from redirecting -->
        <div class="field title">
            <label for="title">Smoothie Title:</label>
            <input type="text" name="title" v-model="title">
        </div>

        <div v-for="(ing, index) in ingredients" :key="index" class="field">
            <label for="ingredient">Ingredient</label>
            <input type="text" name="ingredient" v-model="ingredients[index]"> <!--when we use v-model we have to bind to data in the component -->
            <i class="material-icons delete" @click="deleteIng(ing)">delete</i> <!-- form ing in v-for -->
        </div>
        <div class="field add-ingredient">
            <label for="add-ingredient">Add an Ingredient:</label>
            <input type="text" name="add-ingredient" @keydown.tab.prevent="addIng" v-model="another"> <!-- .tab is a modifier ; .tab.prevent prevents moving to another input field aka we will still be in the active input field-->
        </div>

        <div class="field center-align">
            <p v-if="feedback" class="red-text">{{ feedback }} </p>
            <button class="btn pink">Add Smooothie</button>
        </div>
    </form>
</div>

</template>

<script>
import db from '@/firebase/init'
import slugify from 'slugify'

export default {
    name: 'AddSmoothie',
    data() {
        return {
            title: null,
            another: null,
            ingredients: [],
            feedback: null,
            slug: null
        }
    },
    methods: {
        AddSmoothie(){
            //if user has created a title
            if(this.title){ //if not null
                this.feedback = null
                //create slug
                this.slug = slugify(this.title, { //we use slugify package
                    replacement: '-',
                    remove: /[$*_+.()'"!\-:@]/g, // g means remove globally
                    lower: true //lowercase everything
                })
                db.collection('smoothies').add({ //connnect to db and add
                    title: this.title,
                    ingredients: this.ingredients,
                    slug : this.slug
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
                this.ingredients.push(this.another) //this.another is value of input
                this.another = null //clears input field
                this.feedback = null // feedback doesnt show up 
            }
            else{
                this.feedback = "You must enter a value to add an ingredient"
            }
        },
        deleteIng(ing){
            this.ingredients = this.ingredients.filter(ingredient => {
                return ingredient != ing //filter out/delte if false
            })
        }
    }
}
</script>

<style>
.add-smoothie {
    margin-top: 60px;
    padding: 20px;
    max-width: 500px;
}

.add-smoothie h2 {
    font-size: 2em;
    margin: 20px auto;
}

.add-smoothie .field {
    margin: 20px auto;
    position: relative;
}

.add-smoothie .delete {
    position: absolute;
    right: 0;
    bottom: 16px;
    color: #aaa;
    font-size: 1.4em;
    cursor: pointer;
}
</style>
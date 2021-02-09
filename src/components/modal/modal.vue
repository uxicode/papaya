<template>
  <transition name="modal">
    <div>
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <slot name="header">
                default header
              </slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                default body
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                default footer
                <button class="modal-default-button" @click="close">
                  OK
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-dim" @click.self="close"></div>
    </div>

  </transition>
</template>
<!-- example
<modal v-if="showModal" @close="showModal = false">
  <h3 slot="header">custom header</h3>
  <div slot="body"> default body </div>
  <div slot="footer"> default body </div>
</modal>
-->
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component
export default class Modal extends Vue{
  public close(): void{
    console.log('클릭');
    this.$emit('modalClose');
  }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1050;
  transform:translate(-50%, -50%);
  //width: 100%;
  //height: 100%;
  overflow: hidden;
  outline: 0;
  transition: opacity .3s ease;
}
.modal-dim{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, .5);
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  //width: 300px;
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

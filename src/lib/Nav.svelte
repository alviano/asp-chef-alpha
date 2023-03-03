<script>
  import { Collapse, Icon, Nav, Navbar, NavbarBrand, NavItem, NavLink, NavbarToggler } from 'sveltestrap/src';
  import {Utils} from "$lib/utils";

  let isOpen = false;

  function handleUpdate(event) {
      isOpen = event.detail.isOpen;
  }

  function about() {
      Utils.alert({
          title: "About",
          message: `
          ASP Chef is a simple, intuitive web app for analysing answer sets without having to deal with complex tools or programming languages.
          Proudly brought to you by Mario Alviano and Davide Cirimele.
          `
      });
  }
</script>

<Navbar id="navbar" color="dark d-print-none" style="max-height: 1em;" dark expand="md">
  <NavbarBrand href='/'>
    <span class="logo">
      ASP Chef
    </span>
  </NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ms-auto" navbar>
      <NavItem>
        <NavLink on:click={() => about()}><Icon name="question-circle" /></NavLink>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>

<style>
  .logo {
    font-family: 'Rock Salt', cursive;
  }
</style>

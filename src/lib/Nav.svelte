<script>
  import { Collapse, Nav, Navbar, NavbarBrand, NavItem, NavLink, NavbarToggler } from 'sveltestrap/src';

  let isOpen = false;

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }
</script>

<Navbar color="dark d-print-none" dark expand="md">
  <NavbarBrand href='/'>
    <span class="logo">
      Asp Chef
    </span>
  </NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ms-auto" navbar>
      <NavItem>
        <NavLink on:click={() => alert('?')}>Help</NavLink>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>

<style>
  .logo {
    font-family: 'Rock Salt', cursive;
  }
</style>

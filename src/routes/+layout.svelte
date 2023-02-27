<script>
  import '../app.css';
  import { Button, Container, Offcanvas, Row } from "sveltestrap";
  import Nav from '$lib/Nav.svelte';
  import { privacy_policy } from '$lib/stores';
</script>

<Nav />

<Container fluid>
  <slot />
</Container>

<Offcanvas
  header="Our Cookies and Your Privacy"
  scroll
  isOpen={!$privacy_policy}
  backdrop={false}
  placement="bottom"
>
  <p>We have cookies! They are technical cookies... read more on our <a href="/privacy-policy">privacy policy</a>.</p>
  <Row class="m-3">
    <Button color="primary" on:click={() => privacy_policy.set('accepted')}>Accept and close</Button>
  </Row>
</Offcanvas>
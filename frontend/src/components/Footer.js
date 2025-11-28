import React from 'react';
import { MDBFooter } from 'mdb-react-ui-kit';
// import { IconPhone } from "@tabler/icons-react";
import { Container, Group, ActionIcon, rem } from '@mantine/core';
import { IconMailFilled, IconBrandYoutube, IconBrandInstagram, IconPhone } from '@tabler/icons-react';

import classes from '../FooterSocial.module.css';

function Footer() {
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        {/* <MantineLogo size={28} /> */}
        <Group gap={15} className={classes.links} wrap="nowrap">
          {/* <ActionIcon size="lg" color="gray" variant="subtle"> */}
          <div>
            <IconPhone style={{ width: rem(25), height: rem(25), color:"gray" }} fill={"gray"} stroke={1.5} /> +91 40 4241 7773
          </div>
          {/* </ActionIcon> */}
          <div>
          <IconMailFilled style={{ width: rem(25), height: rem(25), color:"gray",  }} stroke={1.5} /> info@bvrithyderabad.edu.in | principal@bvrithyderabad.edu.in
          </div>

        </Group>
      </Container>
    </div>
  );
}
export default Footer;
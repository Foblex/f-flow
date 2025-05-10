import { IHomePageEnvironment } from '@foblex/m-render';
import {
  MembershipPageImageComponent
} from '../../src/app/home-page/membership-page-image/membership-page-image.component';
import {
  HomePageBackgroundComponent
} from '../../src/app/home-page/home-page-background/home-page-background.component';

export const MEMBERSHIP_ENVIRONMENT: IHomePageEnvironment = {
  logo: './logo.svg',
  title: 'Foblex Flow',
  heroImageComponent: MembershipPageImageComponent,
  backgroundComponent: HomePageBackgroundComponent,
  hero: {
    tagline1: 'Support Foblex Flow',
    subDescription: 'Your support helps us build powerful tools for Angular and keep development going strong.',
  },
  memberships: [ {
    id: 'P-BASIC_PLAN_ID',
    name: 'Basic Supporter',
    description: 'Help us improve and expand Foblex Flow’s capabilities.',
    benefits: [
      'Enables ongoing development and features.',
      'Helps broaden Foblex Flow’s capabilities.',
      'Accelerates innovation and regular updates.'
    ],
    buttonText: 'Support in your own way',
    buttonRef: 'https://www.paypal.com/donate/?hosted_button_id=VXXQ5SRMEU256',
  }, {
    id: 'P-PREMIUM_PLAN_ID',
    name: 'Premium Partnership',
    description: 'Advanced support and custom solutions for your business needs.',
    benefits: [
      'Enhanced support for challenging projects.',
      'Custom solutions aligned with business goals.',
      'Exclusive assistance and expert guidance.'
    ],
    buttonText: 'Get in touch for Partnership',
    buttonRef: 'mailto: support@foblex.com',
  } ],
  footer: {
    text: 'MIT License | Copyright © 2022 - Present',
  }
}


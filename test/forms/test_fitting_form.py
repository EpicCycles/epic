from django import forms

from django.test import TestCase

from epic.forms import FittingForm
from epic.models import Customer, Fitting, EPIC


class FittingFormTestCase(TestCase):

    def setUp(self):
        self.customer = Customer.objects.create(first_name='A', last_name='Customer')
        self.fitting = Fitting.objects.create(customer=self.customer, fitting_type=EPIC, saddle_height='53cm',
                                              reach='34cm', bar_height='44cm', notes='Initial note')

    def test_valid_data(self):
        form = FittingForm({
            'fitting_type': EPIC,
            'saddle_height': "23in",
            'reach': "21in",
            'bar_height': "20in",
        }, instance=None)
        self.assertTrue(form.is_valid())


    def test_fitting_form_single_value_missing(self):
        form = FittingForm({
            'saddle_height': "23in",
            'reach': "21in",
            'bar_height': "20in",
        })
        self.assertFalse(form.is_valid())

        with self.assertRaises(forms.ValidationError):
            form.clean()

        form = FittingForm({
            'fitting_type': EPIC,
            'reach': "21in",
            'bar_height': "20in",
        })
        self.assertFalse(form.is_valid())
        with self.assertRaises(forms.ValidationError):
            form.clean()

        form = FittingForm({
            'fitting_type': EPIC,
            'saddle_height': "23in",
            'bar_height': "20in",
        })
        self.assertFalse(form.is_valid())
        with self.assertRaises(forms.ValidationError):
            form.clean()
        form = FittingForm({
            'fitting_type': EPIC,
            'saddle_height': "23in",
            'reach': "21in",
        })
        with self.assertRaises(forms.ValidationError):
            self.assertFalse(form.is_valid())
            form.clean()

    def test_fitting_form_clean_single_entry(self):

        form = FittingForm({
            'fitting_type': EPIC,
        })
        with self.assertRaises(forms.ValidationError):
            self.assertFalse(form.is_valid())
            form.clean()

        form = FittingForm({
            'saddle_height': "23in",
        })
        with self.assertRaises(forms.ValidationError):
            self.assertFalse(form.is_valid())
            form.clean()

        form = FittingForm({
            'reach': "21in",
        })
        with self.assertRaises(forms.ValidationError):
            self.assertFalse(form.is_valid())
            form.clean()

        form = FittingForm({
            'bar_height': "20in",
        })
        with self.assertRaises(forms.ValidationError):
            self.assertFalse(form.is_valid())
            form.clean()



def test_blank_data_all(self):
        form = FittingForm({
        }, instance=self.fitting)
        self.assertTrue(form.is_valid())

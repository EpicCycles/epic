from django.contrib import admin
from .models import *

class CustomerPhoneInline(admin.TabularInline):
    model = CustomerPhone
    extra = 1

class CustomerAddressInline(admin.TabularInline):
    model = CustomerAddress
    extra = 1


class CustomerAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['first_name','last_name']}),
        ('Email',            {'fields': ['email'],'classes': ['collapse']}),
    ]
    inlines = [CustomerAddressInline, CustomerPhoneInline]
    list_display = ('first_name','last_name','email','add_date')
    list_filter = ['first_name','last_name']
    search_fields = ['first_name','last_name']

class FramePartInline(admin.TabularInline):
    model = FramePart
    extra = 3

class FrameAdmin(admin.ModelAdmin):
    inlines = [FramePartInline]
    list_filter = ['brand']
    search_fields = ['brand']

class PartTypeInLine(admin.TabularInline):
    model = PartType

class PartSectionAdmin(admin.ModelAdmin):
    inlines = [PartTypeInLine]


class PartTypeAttributeInLine(admin.TabularInline):
    model = PartTypeAttribute

class PartTypeAdmin(admin.ModelAdmin):
    inlines = [PartTypeAttributeInLine]

admin.site.register(Frame, FrameAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Brand)
admin.site.register(Part)
admin.site.register(PartSection, PartSectionAdmin)
admin.site.register(PartType, PartTypeAdmin)
admin.site.register(Quote)
admin.site.register(CustomerOrder)

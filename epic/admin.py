from django.contrib import admin
from django.shortcuts import redirect
from django.utils.safestring import mark_safe

from .models import *


# Creates a generic link to allow subsets of forms to be edited
class EditLinkToInlineObject(object):
    def edit_link(self, instance):
        url = reverse('admin:%s_%s_change' % (
            instance._meta.app_label, instance._meta.model_name), args=[instance.pk])
        if instance.pk:
            return mark_safe(u'<a href="{u}">edit</a>'.format(u=url))
        else:
            return ''


class CustomerPhoneInline(admin.TabularInline):
    model = CustomerPhone
    extra = 1


class CustomerAddressInline(admin.TabularInline):
    model = CustomerAddress
    extra = 1


class CustomerAdmin(admin.ModelAdmin):
    fieldsets = [(None, {'fields': ['first_name', 'last_name']}),
                 ('Email', {'fields': ['email'], 'classes': ['collapse']}), ]
    inlines = [CustomerAddressInline, CustomerPhoneInline]
    list_display = ('first_name', 'last_name', 'email', 'add_date')
    list_filter = ['first_name', 'last_name']
    search_fields = ['first_name', 'last_name']


class FramePartInline(admin.TabularInline):
    model = FramePart
    extra = 3


class PartAdmin(admin.ModelAdmin):
    inlines = [FramePartInline]
    list_display = ('partType', 'brand', 'part_name')
    list_filter = ['partType', 'brand']
    search_fields = ['part_name']


class FrameExclusionInline(admin.TabularInline):
    model = FrameExclusion
    extra = 3


class FrameAdmin(admin.ModelAdmin):
    inlines = [FramePartInline, FrameExclusionInline]
    list_filter = ['brand']
    search_fields = ['brand']


class PartTypeInLine(admin.TabularInline):
    model = PartType


class PartSectionAdmin(admin.ModelAdmin):
    inlines = [PartTypeInLine]


class PartTypeAttributeInLine(EditLinkToInlineObject, admin.TabularInline):
    model = PartTypeAttribute
    readonly_fields = ('edit_link',)


class AttributeOptionsInLine(admin.TabularInline):
    model = AttributeOptions


class PartTypeAdmin(admin.ModelAdmin):
    inlines = [PartTypeAttributeInLine]


class PartInLine(admin.TabularInline):
    model = Part


class BrandAdmin(admin.ModelAdmin):
    inlines = [PartInLine]
    list_display = ('brand_name', 'link', 'supplier')
    list_filter = ['supplier']
    search_fields = ['brand_name']


class PartTypeAttributeAdmin(admin.ModelAdmin):
    inlines = [AttributeOptionsInLine]

    def response_post_save_change(self, request, obj):
        # need to show part type /admin/epic/parttype/2/change/
        part_type_id = PartTypeAttribute.objects.get(pk=obj.pk).partType_id
        return redirect("/admin/epic/parttype/%s/change/" % part_type_id)


class SupplierOrderItemInline(admin.TabularInline):
    model = SupplierOrderItem
    extra = 0


class SupplierOrderAdmin(admin.ModelAdmin):
    inlines = [SupplierOrderItemInline]
    list_filter = ['supplier']
    list_per_page = 15


admin.site.register(Frame, FrameAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Brand, BrandAdmin)
admin.site.register(Part, PartAdmin)
admin.site.register(PartSection, PartSectionAdmin)
admin.site.register(PartType, PartTypeAdmin)
admin.site.register(PartTypeAttribute, PartTypeAttributeAdmin)
admin.site.register(Quote)
admin.site.register(CustomerOrder)
admin.site.register(Supplier)
admin.site.register(SupplierOrder, SupplierOrderAdmin)

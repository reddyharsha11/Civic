import React, { useState, useEffect } from "react";
import { Scheme } from "@/context/SchemesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  Trash2,
  Save,
  X,
  Plus,
  Minus,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

interface AdminSchemeModalProps {
  scheme: Scheme | null;
  isOpen: boolean;
  mode: "view" | "edit" | "create";
  onClose: () => void;
  onSave: (scheme: Partial<Scheme>) => void;
  onDelete: (schemeId: string) => void;
}

export const AdminSchemeModal = ({
  scheme,
  isOpen,
  mode,
  onClose,
  onSave,
  onDelete,
}: AdminSchemeModalProps) => {
  const [formData, setFormData] = useState<Partial<Scheme>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (scheme) {
      setFormData(scheme);
    } else if (mode === "create") {
      setFormData({
        name: "",
        description: "",
        category: "",
        department: "",
        keyBenefits: [""],
        eligibilityCriteria: [""],
        applicationProcess: [""],
        requiredDocuments: [""],
        contactInfo: {
          phone: "",
          email: "",
          website: "",
        },
        views: 0,
        status: "Active",
        icon: "📋",
      });
    }
    setErrors({});
  }, [scheme, mode, isOpen]);

  const departments = [
    "Agriculture Department",
    "Social Welfare Department",
    "Women and Child Welfare",
    "IT Department",
    "Health Department",
    "Industries Department",
    "Revenue Department",
    "Education Department",
    "Other",
  ];

  const categories = [
    "Farmers",
    "Senior Citizens",
    "Women",
    "Digital Services",
    "Healthcare",
    "Business",
    "Education",
    "Employment",
    "Other",
  ];

  const statusOptions = ["Active", "Inactive", "Under Review"];

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Scheme name is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category?.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.department?.trim()) {
      newErrors.department = "Department is required";
    }

    if (
      !formData.keyBenefits?.length ||
      formData.keyBenefits?.every((b) => !b.trim())
    ) {
      newErrors.keyBenefits = "At least one key benefit is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // Clean up empty array items
    const cleanedData = {
      ...formData,
      keyBenefits: formData.keyBenefits?.filter((b) => b.trim()) || [],
      eligibilityCriteria:
        formData.eligibilityCriteria?.filter((c) => c.trim()) || [],
      applicationProcess:
        formData.applicationProcess?.filter((p) => p.trim()) || [],
      requiredDocuments:
        formData.requiredDocuments?.filter((d) => d.trim()) || [],
    };

    onSave(cleanedData);
  };

  const handleDelete = () => {
    if (scheme?.id) {
      onDelete(scheme.id);
      setShowDeleteDialog(false);
    }
  };

  const updateArrayField = (
    field: keyof Scheme,
    index: number,
    value: string,
  ) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: keyof Scheme) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData({ ...formData, [field]: [...currentArray, ""] });
  };

  const removeArrayItem = (field: keyof Scheme, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const isReadOnly = mode === "view";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {mode === "create"
                    ? "Create New Scheme"
                    : mode === "edit"
                      ? "Edit Scheme"
                      : "Scheme Details"}
                </DialogTitle>
                <DialogDescription>
                  {mode === "create"
                    ? "Add a new government scheme"
                    : mode === "edit"
                      ? "Modify scheme information"
                      : "View scheme information"}
                </DialogDescription>
              </div>
              {scheme && mode === "view" && (
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    {scheme.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {scheme.views} views
                  </span>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Scheme Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={isReadOnly}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  disabled={isReadOnly}
                  placeholder="📋"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  disabled={isReadOnly}
                >
                  <SelectTrigger
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, department: value })
                  }
                  disabled={isReadOnly}
                >
                  <SelectTrigger
                    className={errors.department ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.department}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "Active"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as Scheme["status"],
                    })
                  }
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={isReadOnly}
                rows={3}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <Label className="text-base font-semibold">
                Contact Information
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.contactInfo?.phone || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactInfo: {
                          ...formData.contactInfo,
                          phone: e.target.value,
                        },
                      })
                    }
                    disabled={isReadOnly}
                    placeholder="1800-425-XXX"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contactInfo?.email || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactInfo: {
                          ...formData.contactInfo,
                          email: e.target.value,
                        },
                      })
                    }
                    disabled={isReadOnly}
                    placeholder="scheme@telangana.gov.in"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="flex gap-2">
                    <Input
                      id="website"
                      value={formData.contactInfo?.website || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: {
                            ...formData.contactInfo,
                            website: e.target.value,
                          },
                        })
                      }
                      disabled={isReadOnly}
                      placeholder="https://scheme.telangana.gov.in"
                    />
                    {formData.contactInfo?.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(formData.contactInfo?.website, "_blank")
                        }
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Array Fields */}
            {[
              "keyBenefits",
              "eligibilityCriteria",
              "applicationProcess",
              "requiredDocuments",
            ].map((field) => (
              <div key={field}>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-semibold">
                    {field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    {field === "keyBenefits" && " *"}
                  </Label>
                  {!isReadOnly && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem(field as keyof Scheme)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {((formData[field as keyof Scheme] as string[]) || []).map(
                    (item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) =>
                            updateArrayField(
                              field as keyof Scheme,
                              index,
                              e.target.value,
                            )
                          }
                          disabled={isReadOnly}
                          placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                        />
                        {!isReadOnly && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeArrayItem(field as keyof Scheme, index)
                            }
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ),
                  )}
                </div>
                {field === "keyBenefits" && errors.keyBenefits && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.keyBenefits}
                  </p>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {mode === "view" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onClose()}
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Scheme
                </Button>
              </>
            )}

            {(mode === "edit" || mode === "create") && (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {mode === "create" ? "Create Scheme" : "Save Changes"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Delete Scheme
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{scheme?.name}"? This action
              cannot be undone and will permanently remove the scheme from the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Scheme
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

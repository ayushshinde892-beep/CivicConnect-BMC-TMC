import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { complaintAPI, uploadAPI } from '../../services/api';
import {
  Building2,
  PlusCircle,
  Upload,
  MapPin,
  Compass,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  X,
  FileText,
  ArrowRight
} from 'lucide-react';

const categories = [
  { value: 'GARBAGE_AND_WASTE', label: 'Garbage & Waste' },
  { value: 'POTHOLES_AND_ROADS', label: 'Potholes & Roads' },
  { value: 'STREETLIGHTS', label: 'Streetlights' },
  { value: 'WATER_SUPPLY', label: 'Water Supply' },
  { value: 'DRAINAGE_AND_SEWAGE', label: 'Drainage & Sewage' },
  { value: 'SANITATION', label: 'Sanitation' },
  { value: 'PUBLIC_TOILETS', label: 'Public Toilets' },
  { value: 'TRAFFIC_AND_PARKING', label: 'Traffic & Parking' },
  { value: 'ILLEGAL_CONSTRUCTION', label: 'Illegal Construction' },
  { value: 'TREE_AND_GARDEN', label: 'Tree & Garden Issues' },
  { value: 'PUBLIC_PROPERTY_DAMAGE', label: 'Public Property Damage' },
  { value: 'OTHER', label: 'Other Civic Issues' },
];

export default function SubmitComplaintPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'GARBAGE_AND_WASTE',
    priority: 'MEDIUM',
    municipalCorporation: 'BMC',
    location: '',
    area: '',
    pincode: '',
    imageUrl: '',
    latitude: '',
    longitude: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdComplaint, setCreatedComplaint] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    // Upload immediately
    setUploading(true);
    try {
      const res = await uploadAPI.uploadFile(file);
      if (res.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
      }
    } catch (err) {
      setError('Image upload failed. You can still submit without an image.');
    } finally {
      setUploading(false);
    }
  };

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            latitude: pos.coords.latitude.toFixed(6),
            longitude: pos.coords.longitude.toFixed(6),
          }));
        },
        (err) => {
          setError('Unable to retrieve current coordinates. Please enter location manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim() || !formData.pincode.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      const res = await complaintAPI.create(payload);
      if (res.success && res.data) {
        setCreatedComplaint(res.data);
      } else {
        setError(res.message || 'Failed to register complaint');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Modal / Banner */}
      {createdComplaint ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Grievance Registered Successfully!</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your complaint has been forwarded to the municipal grievance cell for assignment and inspection.
            </p>
          </div>

          <div className="p-5 bg-blue-50/80 border border-blue-200 rounded-2xl max-w-sm mx-auto space-y-1">
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">Your Unique Complaint ID</span>
            <p className="font-mono text-2xl font-black text-blue-900 tracking-wider">
              {createdComplaint.complaintNumber}
            </p>
            <p className="text-[10px] text-slate-500">Save this ID to track live updates</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={`/track?id=${createdComplaint.complaintNumber}`}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              Track Complaint <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/citizen/dashboard"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-600">Grievance Lodgement</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Register a Civic Complaint</h1>
            <p className="text-xs text-slate-500 mt-1">
              Provide accurate location and details to ensure fast turnaround by municipal departments.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Municipal Corporation Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Select Municipal Corporation <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                    formData.municipalCorporation === 'BMC'
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="municipalCorporation"
                    value="BMC"
                    checked={formData.municipalCorporation === 'BMC'}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">BMC – Mumbai</p>
                    <p className="text-[11px] text-slate-500">Brihanmumbai Municipal Corporation</p>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                    formData.municipalCorporation === 'TMC'
                      ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="municipalCorporation"
                    value="TMC"
                    checked={formData.municipalCorporation === 'TMC'}
                    onChange={handleChange}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">TMC – Thane</p>
                    <p className="text-[11px] text-slate-500">Thane Municipal Corporation</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Step 2: Category and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complaint Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Priority Level <span className="text-rose-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="LOW">Low – Minor inconvenience</option>
                  <option value="MEDIUM">Medium – Standard issue</option>
                  <option value="HIGH">High – Urgent attention needed</option>
                  <option value="URGENT">Urgent – Immediate hazard / safety risk</option>
                </select>
              </div>
            </div>

            {/* Step 3: Title and Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Complaint Title / Short Summary <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Open manhole on LBS Marg near junction"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the problem, severity, duration, and any landmarks..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Step 4: Location Information */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" /> Location Details
                </span>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" /> Detect Coordinates
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Street Address / Landmark <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Opposite Viviana Mall Service Road"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Area / Ward / Suburb <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. Thane West / Dadar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pincode <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="e.g. 400601"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Latitude (Optional)</label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="19.0760"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Longitude (Optional)</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="72.8777"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Attach Evidence Photo (Optional)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="w-full sm:w-auto px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 transition">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Choose Photo File</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>

                {uploading && (
                  <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                    <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    Uploading image...
                  </span>
                )}

                {previewUrl && (
                  <div className="relative group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl('');
                        setFormData((prev) => ({ ...prev, imageUrl: '' }));
                      }}
                      className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5 shadow hover:bg-rose-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                to="/citizen/dashboard"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registering Grievance...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" /> Submit Complaint
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

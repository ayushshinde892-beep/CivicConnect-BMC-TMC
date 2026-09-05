import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { complaintAPI, feedbackAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import VisualTimeline from '../../components/VisualTimeline';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  User,
  Briefcase,
  Phone,
  Mail,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Send,
  Image as ImageIcon
} from 'lucide-react';

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Feedback state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  const fetchDetails = async () => {
    try {
      const res = await complaintAPI.getById(id);
      if (res.success && res.data) {
        setComplaint(res.data);
      } else {
        setError(res.message || 'Complaint not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackError('');
    setFeedbackSuccess('');
    setFeedbackLoading(true);

    try {
      const res = await feedbackAPI.submit({
        complaintId: complaint.id,
        rating,
        comment,
      });

      if (res.success && res.data) {
        setFeedbackSuccess('Thank you! Your feedback has been registered.');
        fetchDetails();
      } else {
        setFeedbackError(res.message || 'Failed to submit feedback');
      }
    } catch (err) {
      setFeedbackError(err.message || 'Failed to submit feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs">Loading grievance details...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
          {error || 'Complaint not found'}
        </div>
        <Link to="/citizen/complaints" className="text-xs font-bold text-blue-600 underline">
          Back to My Complaints
        </Link>
      </div>
    );
  }

  const isResolved = complaint.status === 'RESOLVED' || complaint.status === 'CLOSED';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back button */}
      <div>
        <Link
          to="/citizen/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Complaints
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                {complaint.complaintNumber}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                {complaint.municipalCorporation}
              </span>
              <PriorityBadge priority={complaint.priority} />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{complaint.title}</h1>
          </div>
          <div>
            <StatusBadge status={complaint.status} className="text-sm px-3.5 py-1.5" />
          </div>
        </div>

        {/* Complaint Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Detailed Description</h3>
          <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
            {complaint.description}
          </p>
        </div>

        {/* Image Attachment */}
        {complaint.imageUrl && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" /> Uploaded Photo Attachment
            </h3>
            <div className="rounded-2xl border border-slate-200 overflow-hidden max-w-md bg-slate-50">
              <img
                src={complaint.imageUrl}
                alt="Complaint attachment"
                className="w-full h-auto max-h-72 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Category</span>
            <span className="font-bold text-slate-800">{complaint.categoryDisplayName || complaint.category}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Location</span>
            <span className="font-bold text-slate-800">{complaint.location}, {complaint.area}</span>
            <p className="text-[10px] text-slate-500">Pincode: {complaint.pincode}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Assigned Dept</span>
            <span className="font-bold text-slate-800">{complaint.departmentName || 'Pending Assignment'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Assigned Officer</span>
            <span className="font-bold text-slate-800">{complaint.assignedOfficerName || 'Not yet assigned'}</span>
            {complaint.assignedOfficerPhone && (
              <p className="text-[10px] text-slate-500">Phone: {complaint.assignedOfficerPhone}</p>
            )}
          </div>
        </div>

        {/* Resolution Remarks */}
        {complaint.resolutionRemarks && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resolution Summary
            </h4>
            <p className="text-xs text-emerald-800">{complaint.resolutionRemarks}</p>
            {complaint.resolvedAt && (
              <p className="text-[11px] text-emerald-700 font-medium">
                Resolved on: {new Date(complaint.resolvedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Rejection Reason */}
        {complaint.rejectionReason && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
            <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" /> Official Rejection Reason
            </h4>
            <p className="text-xs text-rose-800">{complaint.rejectionReason}</p>
          </div>
        )}
      </div>

      {/* Post-Resolution Feedback Section */}
      {isResolved && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Citizen Satisfaction Feedback</h3>
              <p className="text-xs text-slate-500">How satisfied are you with the resolution of this civic complaint?</p>
            </div>
          </div>

          {complaint.feedback ? (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= complaint.feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-amber-900 ml-2">
                  {complaint.feedback.rating} / 5 Stars
                </span>
              </div>
              <p className="text-xs text-slate-700 italic">"{complaint.feedback.comment}"</p>
              <p className="text-[10px] text-slate-400">
                Submitted on {new Date(complaint.feedback.createdAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4 pt-2">
              {feedbackSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  {feedbackSuccess}
                </div>
              )}
              {feedbackError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  {feedbackError}
                </div>
              )}

              {/* Star Rating Interactive Input */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:scale-110 transition"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-3">
                  {rating} / 5 ({rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : 'Poor'})
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Comments or Feedback on Municipal Work
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience regarding timeliness, cleanup quality, and officer response..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={feedbackLoading}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                {feedbackLoading ? 'Submitting...' : <><Send className="w-3.5 h-3.5" /> Submit Feedback</>}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Visual Timeline */}
      <VisualTimeline currentStatus={complaint.status} history={complaint.history} />
    </div>
  );
}

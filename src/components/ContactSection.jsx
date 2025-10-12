function ContactSection() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <h2 className="section-title">Liên hệ</h2>
        <form className="contact-form">
          <input type="text" placeholder="Họ và tên" required />
          <input type="number" placeholder="Số Zalo" required />
          <textarea placeholder="Nội dung" rows="5" required></textarea>
          <button type="submit" className="btn btn-primary">Gửi</button>
        </form>
      </div>
    </section>
  );
}
export default ContactSection;

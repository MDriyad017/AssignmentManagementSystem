using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AssignmentManagementSystem.BusinessLogicLayer.Entities;

[Table("auditlogs")]
public partial class AuditLog
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("userid")]
    public int UserId { get; set; }

    [Column("action")]
    [StringLength(100)]
    public string Action { get; set; } = null!;

    [Column("entityname")]
    [StringLength(100)]
    public string EntityName { get; set; } = null!;

    [Column("entityid")]
    public int? EntityId { get; set; }

    [Column("oldvalues", TypeName = "jsonb")]
    public string? OldValues { get; set; }

    [Column("newvalues", TypeName = "jsonb")]
    public string? Newvalues { get; set; }

    [Column("ipaddress")]
    [StringLength(50)]
    public string? IpAddress { get; set; }

    [Column("useragent")]
    [StringLength(500)]
    public string? UserAgent { get; set; }

    [Column("createdat", TypeName = "timestamp without time zone")]
    public DateTime CreatedAt { get; set; }

    [ForeignKey(nameof(UserId))]
    [InverseProperty(nameof(User.AuditLogs))]
    public virtual User User { get; set; } = null!;
}
